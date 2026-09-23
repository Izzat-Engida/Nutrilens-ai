import re

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2, "light": 1.375, "moderate": 1.55,
    "active": 1.725, "very_active": 1.9,
}
SUPPORTED_GOALS = {"lose_weight", "maintain_weight", "gain_weight", "build_muscle"}
MINIMUM_CALORIES = 1200


def _error(message):
    raise ValueError(message)


def parse_pace(pace):
    value = str(pace).strip().lower().replace(",", ".")
    match = re.search(r"(\d+(?:\.\d+)?)", value)
    parsed = float(match.group(1)) if match else {"slow": .25, "moderate": .5, "fast": .75}.get(value)
    if parsed is None or not 0 < parsed <= 1:
        _error("Pace must represent between 0 and 1 kg per week.")
    return parsed


def validate_profile_for_nutrition(profile):
    required = ("goal", "gender", "age", "height_cm", "weight_kg", "activity_level", "target_weight_kg", "pace")
    missing = [field for field in required if getattr(profile, field, None) in (None, "")]
    if missing:
        _error(f"Profile is incomplete. Missing: {', '.join(missing)}.")
    if not 13 <= profile.age <= 120:
        _error("Age must be between 13 and 120.")
    if not 50 <= profile.height_cm <= 300:
        _error("Height must be between 50 and 300 cm.")
    if not 20 <= profile.weight_kg <= 500:
        _error("Weight must be between 20 and 500 kg.")
    if not 20 <= profile.target_weight_kg <= 500:
        _error("Target weight must be between 20 and 500 kg.")
    if str(profile.gender).strip().lower() not in {"male", "female"}:
        _error("Gender must be either 'male' or 'female' for nutrition calculations.")
    if str(profile.activity_level).strip().lower() not in ACTIVITY_MULTIPLIERS:
        _error("Activity level must be one of: " + ", ".join(ACTIVITY_MULTIPLIERS) + ".")
    if str(profile.goal).strip().lower() not in SUPPORTED_GOALS:
        _error("Goal must be one of: " + ", ".join(sorted(SUPPORTED_GOALS)) + ".")
    if str(profile.goal).strip().lower() in {"lose_weight", "gain_weight"}:
        parse_pace(profile.pace)


def calculate_bmr(profile):
    validate_profile_for_nutrition(profile)
    base = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age
    return round(base + (5 if profile.gender.strip().lower() == "male" else -161))


def get_activity_multiplier(activity_level):
    try:
        return ACTIVITY_MULTIPLIERS[str(activity_level).strip().lower()]
    except KeyError:
        _error("Invalid activity level.")


def calculate_tdee(profile):
    return round(calculate_bmr(profile) * get_activity_multiplier(profile.activity_level))


def calculate_calorie_target(profile):
    validate_profile_for_nutrition(profile)
    tdee = calculate_tdee(profile)
    goal = profile.goal.strip().lower()
    if goal == "maintain_weight":
        adjustment = 0
    elif goal == "build_muscle":
        adjustment = 200
    else:
        adjustment = round(parse_pace(profile.pace) * 7700 / 7)
        if goal == "lose_weight":
            adjustment = -adjustment
    return max(MINIMUM_CALORIES, round(tdee + adjustment))


calculate_daily_calories = calculate_calorie_target
