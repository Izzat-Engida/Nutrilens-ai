from django.contrib import admin

from .models import Recommendation


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ("user", "category", "title", "priority", "is_read", "created_at", "expires_at")
    list_filter = ("category", "priority", "is_read")
    search_fields = ("user__email", "title", "message")
