from rest_framework import serializers
from django.db import transaction

from .models import Meal, MealItem


class MealItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealItem
        fields = [
            "id", "food_name", "quantity", "unit", "calories",
            "protein", "carbohydrates", "fat",
        ]
        read_only_fields = ["id"]

    def validate_food_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Food name cannot be empty.")
        return value

    def validate_unit(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Unit cannot be empty.")
        return value


class MealSerializer(serializers.ModelSerializer):
    items = MealItemSerializer(many=True)

    class Meta:
        model = Meal
        fields = [
            "id", "meal_type", "consumed_at", "notes", "items",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_meal_type(self, value):
        valid_types = {choice[0] for choice in Meal.MEAL_TYPE_CHOICES}
        if value not in valid_types:
            raise serializers.ValidationError("Invalid meal type.")
        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("A meal must contain at least one food item.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")
        meal = Meal.objects.create(user=self.context["request"].user, **validated_data)
        MealItem.objects.bulk_create([MealItem(meal=meal, **item) for item in items])
        return meal

    @transaction.atomic
    def update(self, instance, validated_data):
        items_provided = "items" in validated_data
        items = validated_data.pop("items", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if items_provided:
            instance.items.all().delete()
            MealItem.objects.bulk_create([
                MealItem(meal=instance, **item) for item in items
            ])
        return instance
