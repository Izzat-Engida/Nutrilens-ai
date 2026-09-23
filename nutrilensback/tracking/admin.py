from django.contrib import admin

from .models import WeightEntry


@admin.register(WeightEntry)
class WeightEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "weight_kg", "date", "created_at")
    list_filter = ("date",)
    search_fields = ("user__email",)
