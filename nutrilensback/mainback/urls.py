
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/nutrition/", include("nutrition.urls")),
    path("api/meals/", include("meals.urls")),
    path("api/tracking/", include("tracking.urls")),
]
