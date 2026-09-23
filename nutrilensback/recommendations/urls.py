from django.urls import path

from .views import RecommendationGenerateView, RecommendationListView, RecommendationReadView

urlpatterns = [
    path("", RecommendationListView.as_view(), name="recommendation-list"),
    path("generate/", RecommendationGenerateView.as_view(), name="recommendation-generate"),
    path("<int:pk>/read/", RecommendationReadView.as_view(), name="recommendation-read"),
]
