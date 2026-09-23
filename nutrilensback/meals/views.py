from datetime import datetime, time

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from nutrition.services.daily_sync import sync_daily_nutrition

from .models import Meal
from .serializers import MealSerializer


def _day_bounds(value):
    try:
        requested_date = datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        raise ValueError("date must use YYYY-MM-DD format.") from None

    current_timezone = timezone.get_current_timezone()
    start = timezone.make_aware(datetime.combine(requested_date, time.min), current_timezone)
    end = timezone.make_aware(datetime.combine(requested_date, time.max), current_timezone)
    return start, end


class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Meal.objects.filter(user=self.request.user).prefetch_related("items")

        requested_date = self.request.query_params.get("date")
        if requested_date:
            try:
                start, end = _day_bounds(requested_date)
            except ValueError as exc:
                # Stored for list() to return a proper API error without
                # affecting retrieve/update/delete behavior.
                self._date_error = str(exc)
            else:
                queryset = queryset.filter(consumed_at__range=(start, end))

        start_date = self.request.query_params.get("from")
        end_date = self.request.query_params.get("to")
        try:
            if start_date:
                queryset = queryset.filter(consumed_at__gte=_day_bounds(start_date)[0])
            if end_date:
                queryset = queryset.filter(consumed_at__lte=_day_bounds(end_date)[1])
        except ValueError as exc:
            self._date_error = str(exc)
        return queryset

    def list(self, request, *args, **kwargs):
        self._date_error = None
        queryset = self.filter_queryset(self.get_queryset())
        if self._date_error:
            return Response({"detail": self._date_error}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        meal = serializer.save()
        sync_daily_nutrition(self.request.user, meal.consumed_at)

    def perform_update(self, serializer):
        previous_consumed_at = serializer.instance.consumed_at
        meal = serializer.save()
        sync_daily_nutrition(self.request.user, previous_consumed_at)
        sync_daily_nutrition(self.request.user, meal.consumed_at)

    def perform_destroy(self, instance):
        user = instance.user
        consumed_at = instance.consumed_at
        instance.delete()
        sync_daily_nutrition(user, consumed_at)
