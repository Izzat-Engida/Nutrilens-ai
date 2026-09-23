from datetime import date, datetime, time

from django.db.models import Sum
from django.utils import timezone

from meals.models import MealItem

from .calorie_calculator import calculate_calorie_target, validate_profile_for_nutrition
from .macro_calculator import calculate_macro_targets
from accounts.models import Profile
from nutrition.models import DailyNutrition


def _day_bounds(value):
    requested_date = datetime.strptime(value, "%Y-%m-%d").date()
    current_timezone = timezone.get_current_timezone()
    start = timezone.make_aware(datetime.combine(requested_date, time.min), current_timezone)
    end = timezone.make_aware(datetime.combine(requested_date, time.max), current_timezone)
    return start, end


def _as_local_date(value):
    if isinstance(value, datetime):
        if timezone.is_naive(value):
            value = timezone.make_aware(value, timezone.get_current_timezone())
        return timezone.localtime(value).date()
    if isinstance(value, date):
        return value
    return timezone.localdate()


def sync_daily_nutrition(user, consumed_at):
    requested_date = _as_local_date(consumed_at)
    try:
        profile = Profile.objects.get(user=user)
        validate_profile_for_nutrition(profile)
        calorie_target = calculate_calorie_target(profile)
        macros = calculate_macro_targets(profile, calorie_target)
    except (Profile.DoesNotExist, ValueError):
        return None

    record, _ = DailyNutrition.objects.get_or_create(
        user=user,
        date=requested_date,
        defaults={
            "calorie_target": calorie_target,
            "protein_target": macros["protein"],
            "carbohydrate_target": macros["carbohydrates"],
            "fat_target": macros["fat"],
        },
    )

    start, end = _day_bounds(requested_date.isoformat())
    totals = MealItem.objects.filter(
        meal__user=user,
        meal__consumed_at__range=(start, end),
    ).aggregate(
        calories=Sum("calories"),
        protein=Sum("protein"),
        carbs=Sum("carbohydrates"),
        fat=Sum("fat"),
    )

    record.calorie_target = calorie_target
    record.protein_target = macros["protein"]
    record.carbohydrate_target = macros["carbohydrates"]
    record.fat_target = macros["fat"]
    record.calories_consumed = int(totals["calories"] or 0)
    record.protein_consumed = int(totals["protein"] or 0)
    record.carbohydrates_consumed = int(totals["carbs"] or 0)
    record.fat_consumed = int(totals["fat"] or 0)
    record.save()
    return record
