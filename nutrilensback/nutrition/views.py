from datetime import date

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile
from .models import DailyNutrition
from .serializers import DailyNutritionSerializer
from .services import calculate_calorie_target, calculate_macro_targets, validate_profile_for_nutrition


def _requested_date(request):
    value = request.query_params.get("date")
    if not value:
        return timezone.localdate()
    try:
        return date.fromisoformat(value)
    except ValueError:
        raise ValueError("date must use YYYY-MM-DD format.") from None


def _get_daily_record(user, requested_date):
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return None, Response({"code": "profile_required", "detail": "Complete your profile before requesting nutrition data."}, status=status.HTTP_404_NOT_FOUND)
    try:
        validate_profile_for_nutrition(profile)
        calorie_target = calculate_calorie_target(profile)
        macros = calculate_macro_targets(profile, calorie_target)
    except ValueError as exc:
        return None, Response({"code": "profile_incomplete", "detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    record, _ = DailyNutrition.objects.get_or_create(
        user=user, date=requested_date,
        defaults={"calorie_target": calorie_target, "protein_target": macros["protein"], "carbohydrate_target": macros["carbohydrates"], "fat_target": macros["fat"]},
    )
    return record, None


class DailyNutritionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            requested_date = _requested_date(request)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        record, error = _get_daily_record(request.user, requested_date)
        if error:
            return error
        return Response(DailyNutritionSerializer(record).data)


class NutritionSummaryView(DailyNutritionView):
    pass


class NutritionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = DailyNutrition.objects.filter(user=request.user)
        try:
            if request.query_params.get("from"):
                queryset = queryset.filter(date__gte=date.fromisoformat(request.query_params["from"]))
            if request.query_params.get("to"):
                queryset = queryset.filter(date__lte=date.fromisoformat(request.query_params["to"]))
        except ValueError:
            return Response({"detail": "from and to must use YYYY-MM-DD format."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(DailyNutritionSerializer(queryset, many=True).data)
