from rest_framework import serializers

from .models import DailyNutrition


class DailyNutritionSerializer(serializers.ModelSerializer):
    calorie_goal = serializers.IntegerField(source="calorie_target")
    protein_goal = serializers.IntegerField(source="protein_target")
    carbs_goal = serializers.IntegerField(source="carbohydrate_target")
    fat_goal = serializers.IntegerField(source="fat_target")
    carbs_consumed = serializers.IntegerField(source="carbohydrates_consumed")
    calories_remaining = serializers.SerializerMethodField()
    protein_remaining = serializers.SerializerMethodField()
    carbs_remaining = serializers.SerializerMethodField()
    fat_remaining = serializers.SerializerMethodField()

    class Meta:
        model = DailyNutrition
        fields = [
            "date", "calorie_goal", "calories_consumed", "calories_remaining",
            "protein_goal", "protein_consumed", "protein_remaining",
            "carbs_goal", "carbs_consumed", "carbs_remaining",
            "fat_goal", "fat_consumed", "fat_remaining",
        ]
        read_only_fields = fields

    @staticmethod
    def _remaining(target, consumed):
        return max(0, target - consumed)

    def get_calories_remaining(self, obj):
        return self._remaining(obj.calorie_target, obj.calories_consumed)

    def get_protein_remaining(self, obj):
        return self._remaining(obj.protein_target, obj.protein_consumed)

    def get_carbs_remaining(self, obj):
        return self._remaining(obj.carbohydrate_target, obj.carbohydrates_consumed)

    def get_fat_remaining(self, obj):
        return self._remaining(obj.fat_target, obj.fat_consumed)
