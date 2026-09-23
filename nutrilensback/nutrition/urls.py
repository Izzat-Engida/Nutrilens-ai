from django.urls import path

from .views import DailyNutritionView, NutritionHistoryView, NutritionSummaryView

urlpatterns = [
    path("daily/", DailyNutritionView.as_view(), name="nutrition-daily"),
    path("summary/", NutritionSummaryView.as_view(), name="nutrition-summary"),
    path("history/", NutritionHistoryView.as_view(), name="nutrition-history"),
]
