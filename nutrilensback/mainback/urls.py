
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/nutrition/", include("nutrition.urls")),
    path("api/meals/", include("meals.urls")),
    path("api/tracking/", include("tracking.urls")),
    path("api/recommendations/", include("recommendations.urls")),
    path("api/food-analysis/", include("food_analysis.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
