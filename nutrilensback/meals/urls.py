from rest_framework.routers import DefaultRouter

from .views import MealViewSet

router = DefaultRouter()
router.register("", MealViewSet, basename="meal")

urlpatterns = router.urls
