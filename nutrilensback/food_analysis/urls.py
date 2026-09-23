from django.urls import path

from .views import FoodAnalysisDetailView, FoodAnalysisHistoryView, FoodAnalysisView

urlpatterns = [
    path("analyze/", FoodAnalysisView.as_view(), name="food-analysis-analyze"),
    path("history/", FoodAnalysisHistoryView.as_view(), name="food-analysis-history"),
    path("history/<int:pk>/", FoodAnalysisDetailView.as_view(), name="food-analysis-detail"),
    path("<int:pk>/confirm/", FoodAnalysisDetailView.as_view(), name="food-analysis-confirm"),
]
