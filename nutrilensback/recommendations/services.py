from datetime import datetime, time, timedelta
from decimal import Decimal

from django.db import transaction
from django.db.models import Sum
from django.utils import timezone

from accounts.models import Profile
from meals.models import MealItem
from nutrition.models import DailyNutrition
from nutrition.services import calculate_calorie_target, calculate_macro_targets
from tracking.models import WeightEntry

from .models import Recommendation


def _today_range():
    today = timezone.localdate()
    current_timezone = timezone.get_current_timezone()
    start = timezone.make_aware(datetime.combine(today, time.min), current_timezone)
    end = start + timedelta(days=1)
    return today, start, end


def _add_rule(rules, key, category, title, message, priority):
    rules.append({
        "rule_key": key,
        "category": category,
        "title": title,
        "message": message,
        "priority": priority,
    })


def _target_values(profile, today):
    daily = DailyNutrition.objects.filter(user=profile.user, date=today).first()
    if daily:
        return daily.calorie_target, daily.protein_target
    calorie_target = calculate_calorie_target(profile)
    macros = calculate_macro_targets(profile, calorie_target)
    return calorie_target, macros["protein"]


def _meal_totals(user, start, end):
    totals = MealItem.objects.filter(
        meal__user=user,
        meal__consumed_at__gte=start,
        meal__consumed_at__lt=end,
    ).aggregate(
        calories=Sum("calories"),
        protein=Sum("protein"),
    )
    return (
        totals["calories"] or Decimal("0"),
        totals["protein"] or Decimal("0"),
    )


def _progress_rule(rules, profile, user):
    entries = list(WeightEntry.objects.filter(user=user).order_by("date", "id"))
    if len(entries) < 2:
        return

    starting = entries[0].weight_kg
    current = entries[-1].weight_kg
    target = Decimal(str(profile.target_weight_kg))
    start_distance = abs(starting - target)
    current_distance = abs(current - target)
    if current_distance < start_distance:
        _add_rule(
            rules, "progress_moving_toward_target", Recommendation.PROGRESS,
            "You are moving toward your target",
            "Your recent weight trend is moving closer to your target weight. Keep your routine consistent.",
            Recommendation.LOW,
        )
    elif current_distance > start_distance:
        _add_rule(
            rules, "progress_moving_away_from_target", Recommendation.WEIGHT,
            "Review your progress",
            "Your recent weight trend is moving away from your target. Review your meal consistency and daily nutrition plan.",
            Recommendation.MEDIUM,
        )


@transaction.atomic
def generate_recommendations(user):
    rules = []
    today, start, end = _today_range()
    now = timezone.now()

    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        _add_rule(
            rules, "profile_required", Recommendation.GENERAL,
            "Complete your profile",
            "Complete your nutrition profile so NutriLens can personalize your targets and recommendations.",
            Recommendation.HIGH,
        )
        profile = None

    if profile:
        try:
            calorie_target, protein_target = _target_values(profile, today)
        except ValueError:
            _add_rule(
                rules, "profile_incomplete", Recommendation.GENERAL,
                "Complete your nutrition details",
                "Add valid goal, activity, body measurements, and pace information to receive personalized recommendations.",
                Recommendation.HIGH,
            )
        else:
            calories, protein = _meal_totals(user, start, end)
            if protein < Decimal(str(protein_target)) * Decimal("0.8"):
                _add_rule(
                    rules, "protein_below_target", Recommendation.PROTEIN,
                    "Increase your protein",
                    f"You have logged {protein:.0f}g of protein against a {protein_target}g target today. Consider adding a protein-rich meal.",
                    Recommendation.MEDIUM,
                )
            if calories > Decimal(str(calorie_target)):
                _add_rule(
                    rules, "calories_above_target", Recommendation.CALORIES,
                    "Review your calorie intake",
                    f"You have logged {calories:.0f} calories against a {calorie_target} calorie target today. Consider balancing your remaining meals.",
                    Recommendation.HIGH,
                )
            elif Decimal(str(calorie_target)) * Decimal("0.85") <= calories <= Decimal(str(calorie_target)):
                _add_rule(
                    rules, "calories_near_target", Recommendation.CALORIES,
                    "You are near your calorie target",
                    "You are close to your daily calorie target. Keep your remaining choices aligned with your plan.",
                    Recommendation.LOW,
                )
            _progress_rule(rules, profile, user)

    recent_meals = MealItem.objects.filter(
        meal__user=user,
        meal__consumed_at__gte=now - timedelta(days=2),
    ).exists()
    if not recent_meals:
        _add_rule(
            rules, "meal_logging_gap", Recommendation.MEALS,
            "Log your meals",
            "You have not logged a meal recently. Recording meals helps keep your nutrition progress accurate.",
            Recommendation.MEDIUM,
        )

    expires_at = now + timedelta(days=1)
    for rule in rules:
        Recommendation.objects.update_or_create(
            user=user,
            rule_key=rule["rule_key"],
            defaults={**rule, "is_read": False, "expires_at": expires_at},
        )

    active_keys = {rule["rule_key"] for rule in rules}
    Recommendation.objects.filter(
        user=user,
    ).exclude(
        rule_key__in=active_keys,
    ).update(
        expires_at=now,
    )
    Recommendation.objects.filter(
        user=user,
        expires_at__lt=now,
    ).delete()
    return Recommendation.objects.filter(
        user=user,
        rule_key__in=active_keys,
    ).order_by("is_read", "-created_at")
