from django.contrib import admin

from .models import FoodAnalysis


@admin.register(FoodAnalysis)
class FoodAnalysisAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "detected_food", "confidence", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email", "detected_food")
    readonly_fields = ("created_at", "updated_at", "confirmed_at")
