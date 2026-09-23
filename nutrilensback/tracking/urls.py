from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ProgressView, WeightEntryViewSet

router = DefaultRouter()
router.register("weight", WeightEntryViewSet, basename="weight-entry")

urlpatterns = router.urls + [
    path("progress/", ProgressView.as_view(), name="tracking-progress"),
]
