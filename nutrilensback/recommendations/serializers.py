from rest_framework import serializers

from .models import Recommendation


class RecommendationSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="category")

    class Meta:
        model = Recommendation
        fields = [
            "id", "type", "title", "message", "priority", "is_read",
            "created_at", "expires_at",
        ]
        read_only_fields = fields


class RecommendationReadSerializer(serializers.Serializer):
    is_read = serializers.BooleanField(required=False, default=True)
