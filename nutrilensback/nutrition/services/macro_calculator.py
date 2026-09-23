from .calorie_calculator import validate_profile_for_nutrition


def calculate_macro_targets(profile, calorie_target):
    validate_profile_for_nutrition(profile)
    if calorie_target <= 0:
        raise ValueError("Calorie target must be positive.")
    factor = 1.6 if profile.goal.strip().lower() in {"lose_weight", "gain_weight", "build_muscle"} else 1.2
    protein = round(profile.target_weight_kg * factor)
    fat = round(calorie_target * .25 / 9)
    carbs = round((calorie_target - protein * 4 - fat * 9) / 4)
    if carbs < 0:
        raise ValueError("Calorie target is too low for calculated macro targets.")
    return {"protein": protein, "carbohydrates": carbs, "fat": fat}
