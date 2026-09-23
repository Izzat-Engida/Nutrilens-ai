from decimal import Decimal

from PIL import Image, UnidentifiedImageError
from rest_framework import serializers

from django.conf import settings

from .models import FoodAnalysis


class FoodAnalysisSerializer(serializers.ModelSerializer):
    nutrition = serializers.SerializerMethodField()

    class Meta:
        model = FoodAnalysis
        fields = [
            "id", "status", "predictions", "detected_food", "confidence",
            "estimated_portion_grams", "nutrition", "created_at",
        ]
        read_only_fields = fields

    def get_nutrition(self, obj):
        # A classifier does not provide portion-aware nutrition. This remains a
        # stable extension point for a future nutrition database integration.
        return None


class FoodAnalysisUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()

    def validate_image(self, value):
        if value.size > settings.FOOD_ANALYSIS_MAX_IMAGE_SIZE:
            raise serializers.ValidationError("Image must be 10 MB or smaller.")
        try:
            value.seek(0)
            with Image.open(value) as image:
                image.verify()
            value.seek(0)
        except (UnidentifiedImageError, OSError):
            raise serializers.ValidationError("Upload a valid image file.") from None
        return value


class FoodAnalysisConfirmationSerializer(serializers.Serializer):
    detected_food = serializers.CharField(required=False, max_length=200)
    estimated_portion_grams = serializers.DecimalField(
        required=False, allow_null=True, max_digits=8, decimal_places=2, min_value=Decimal("0.01")
    )

    def validate_detected_food(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Food name cannot be empty.")
        return value
