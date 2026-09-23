from rest_framework import serializers

from .models import WeightEntry


class WeightEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightEntry
        fields = ["id", "weight_kg", "date", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_weight_kg(self, value):
        if value <= 0:
            raise serializers.ValidationError("Weight must be greater than zero.")
        return value

    def validate_date(self, value):
        from django.utils import timezone

        if value > timezone.localdate():
            raise serializers.ValidationError("Weight date cannot be in the future.")
        return value

    def validate(self, attrs):
        user = self.context["request"].user
        entry_date = attrs.get("date", getattr(self.instance, "date", None))
        existing = WeightEntry.objects.filter(user=user, date=entry_date)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)
        if entry_date and existing.exists():
            raise serializers.ValidationError({
                "date": "A weight entry already exists for this date."
            })
        return attrs


class WeightProgressSerializer(serializers.Serializer):
    current_weight = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    starting_weight = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    lowest_weight = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    highest_weight = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    total_change = serializers.DecimalField(max_digits=8, decimal_places=2, allow_null=True)
    target_weight = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    target_progress_percent = serializers.DecimalField(max_digits=7, decimal_places=2, allow_null=True)
    entries_count = serializers.IntegerField()
    history = WeightEntrySerializer(many=True)
