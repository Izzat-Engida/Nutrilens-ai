# Complete Backend Guide: Django REST Framework & PostgreSQL for Nutrilens

This guide is tailored specifically to your **Nutrilens Expo/React Native frontend** (`app/src/store/nutritionStore.ts`, `Scan.tsx`, `Home.tsx`, `types/scan.ts`). It walks you through building the complete Django REST Framework backend with PostgreSQL, implementing every single feature and data model used by your frontend.

---

## Table of Contents
1. [Overview & Frontend-to-Backend Mapping](#1-overview--frontend-to-backend-mapping)
2. [Prerequisites & Package Installation](#2-prerequisites--package-installation)
3. [PostgreSQL Database Setup](#3-postgresql-database-setup)
4. [Environment Variables & Django `settings.py`](#4-environment-variables--django-settingspy)
5. [Database Models (`models.py`) Matching Frontend Types](#5-database-models-modelspy-matching-frontend-types)
6. [Serializers (`serializers.py`)](#6-serializers-serializerspy)
7. [API Views & Endpoints (`views.py`)](#7-api-views--endpoints-viewspy)
8. [URL Routing (`urls.py`)](#8-url-routing-urlspy)
9. [Database Migrations & Test Server](#9-database-migrations--test-server)
10. [Integrating Frontend Zustand Store (`nutritionStore.ts`) with Backend APIs](#10-integrating-frontend-zustand-store-nutritionstorets-with-backend-apis)

---

## 1. Overview & Frontend-to-Backend Mapping

Here is how your frontend store state & actions (`nutritionStore.ts`) map directly to Django REST Framework endpoints:

| Frontend Feature / Function (`nutritionStore.ts`) | Type / Data Source | Django REST Endpoint | HTTP Method |
| :--- | :--- | :--- | :--- |
| User Profile & Goals (`calorieGoal`, `macros`) | `UserProfile` | `/api/user/profile/` | `GET`, `PATCH` |
| `weightProgress`, `currentWeightKg` | `WeightPoint[]` | `/api/weight/` | `GET`, `POST` |
| `recentMeals`, `caloriesConsumed` | `RecentMeal[]` | `/api/meals/recent/` | `GET` |
| `saveScannedMeal()` | `ScanState` ➔ `MealLog` | `/api/meals/save-scanned/` | `POST` |
| `updateScanPhoto()`, AI food recognition | `DetectedFood[]` | `/api/scan/analyze/` | `POST` |
| User Authentication | Login / Register | `/api/auth/login/`, `/api/auth/register/` | `POST` |

---

## 2. Prerequisites & Package Installation

Navigate to `nutrilensback/` and activate your virtual environment:

```bash
cd nutrilensback
source ../venv/bin/activate
```

Install all required dependencies:

```bash
pip install Django djangorestframework django-cors-headers djangorestframework-simplejwt psycopg2-binary pillow python-dotenv
```

Save dependencies to `requirements.txt`:
```bash
pip freeze > ../requirements.txt
```

---

## 3. PostgreSQL Database Setup

Run PostgreSQL shell:
```bash
sudo -u postgres psql
```

Execute SQL commands to create database and user:
```sql
CREATE DATABASE nutrilens_db;
CREATE USER nutrilens_user WITH PASSWORD 'your_secure_password';
ALTER ROLE nutrilens_user SET client_encoding TO 'utf8';
ALTER ROLE nutrilens_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE nutrilens_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE nutrilens_db TO nutrilens_user;
\q
```

---

## 4. Environment Variables & Django `settings.py`

### 4.1 Create `.env` file in `nutrilensback/`
```env
SECRET_KEY=django-insecure-nutrilens-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,10.0.2.2

# PostgreSQL Configuration
DB_NAME=nutrilens_db
DB_USER=nutrilens_user
DB_PASSWORD=your_secure_password
DB_HOST=127.0.0.1
DB_PORT=5432
```

### 4.2 Update `nutrilensback/mainback/settings.py`
```python
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party Apps
    'rest_framework',
    'corsheaders',

    # Local Apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Top priority for CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# PostgreSQL Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'nutrilens_db'),
        'USER': os.getenv('DB_USER', 'nutrilens_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'your_secure_password'),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Allow CORS requests from Expo app
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# Media files (for scanned food photos)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## 5. Database Models (`models.py`) Matching Frontend Types

Create an app if you haven't already:
```bash
python manage.py startapp api
```

In `nutrilensback/api/models.py`, define models matching your frontend types (`ScanState`, `DetectedFood`, `RecentMeal`, `WeightPoint`):

```python
from django.db import models
from django.contrib.auth.models import User

# 1. User Profile (Goals & Daily Targets)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    calorie_goal = models.IntegerField(default=2000)
    current_weight_kg = models.FloatField(default=70.0)
    streak_days = models.IntegerField(default=1)
    
    # Macro goals (in grams or liters)
    protein_goal = models.FloatField(default=140.0)
    water_goal = models.FloatField(default=3.0)
    carbs_goal = models.FloatField(default=260.0)
    fat_goal = models.FloatField(default=70.0)

    def __str__(self):
        return f"{self.user.username}'s Profile"


# 2. Weight Tracking History (Matches WeightPoint type)
class WeightLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_logs')
    value = models.FloatField()  # e.g., 72.5 kg
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.user.username} - {self.value}kg on {self.date}"


# 3. Meal Logs (Matches RecentMeal type)
MEAL_TYPES = (
    ('breakfast', 'Breakfast'),
    ('lunch', 'Lunch'),
    ('dinner', 'Dinner'),
    ('snack', 'Snack'),
)

class MealLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    food_name = models.CharField(max_length=255)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES, default='lunch')
    calories = models.IntegerField(default=0)
    portion = models.CharField(max_length=50, default='1 plate')
    icon = models.CharField(max_length=50, default='drumstick')
    photo = models.ImageField(upload_to='scanned_meals/', null=True, blank=True)
    barcode = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.food_name} ({self.calories} kcal) - {self.meal_type}"


# 4. Individual Foods Detected in a Meal Scan (Matches DetectedFood type)
class DetectedFoodItem(models.Model):
    meal = models.ForeignKey(MealLog, on_delete=models.CASCADE, related_name='detected_foods')
    name = models.CharField(max_length=255)
    grams = models.IntegerField(default=100)
    calories = models.IntegerField(default=0)
    protein = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)
    fat = models.FloatField(default=0.0)
    confidence = models.IntegerField(default=90)  # Percentage e.g. 94%

    def __str__(self):
        return f"{self.name} ({self.grams}g)"
```

---

## 6. Serializers (`serializers.py`)

Create `nutrilensback/api/serializers.py`:

```python
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, WeightLog, MealLog, DetectedFoodItem

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'


class WeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightLog
        fields = ('id', 'value', 'date')
        read_only_fields = ('id', 'date')


class DetectedFoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectedFoodItem
        fields = ('id', 'name', 'grams', 'calories', 'protein', 'carbs', 'fat', 'confidence')


class MealLogSerializer(serializers.ModelSerializer):
    detected_foods = DetectedFoodItemSerializer(many=True, required=False)

    class Meta:
        model = MealLog
        fields = ('id', 'food_name', 'meal_type', 'calories', 'portion', 'icon', 'photo', 'barcode', 'created_at', 'detected_foods')
        read_only_fields = ('id', 'created_at')
```

---

## 7. API Views & Endpoints (`views.py`)

In `nutrilensback/api/views.py`:

```python
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum
from django.utils.timezone import now

from .models import UserProfile, WeightLog, MealLog, DetectedFoodItem
from .serializers import (
    UserRegistrationSerializer, UserProfileSerializer, 
    WeightLogSerializer, MealLogSerializer
)

# 1. User Registration View
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 2. User Profile View (Get & Update Goals)
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)


# 3. Weight Tracking ViewSet (Graph Data)
class WeightLogViewSet(viewsets.ModelViewSet):
    serializer_class = WeightLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeightLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        weight_instance = serializer.save(user=self.request.user)
        # Update user's current weight in profile
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        profile.current_weight_kg = weight_instance.value
        profile.save()


# 4. Recent Meals ViewSet
class MealLogViewSet(viewsets.ModelViewSet):
    serializer_class = MealLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealLog.objects.filter(user=self.request.user)


# 5. AI Food Recognition Analysis Endpoint (For Scan.tsx)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyze_scan(request):
    """
    Receives an image file or barcode from Scan.tsx and returns detected foods.
    """
    photo = request.FILES.get('photo')
    barcode = request.data.get('barcode')

    # Example response (Replace with real AI model call e.g., Gemini Vision / OpenAI API)
    mock_detected_foods = [
        {"id": "1", "name": "Grilled Chicken", "grams": 150, "calories": 280, "protein": 32, "carbs": 0, "fat": 16, "confidence": 92},
        {"id": "2", "name": "Steamed Rice", "grams": 200, "calories": 260, "protein": 5, "carbs": 57, "fat": 1, "confidence": 95},
    ]

    return Response({
        "success": True,
        "scanned_barcode": barcode,
        "foods": mock_detected_foods
    }, status=status.HTTP_200_OK)


# 6. Save Scanned Meal Endpoint (Matches saveScannedMeal in Zustand store)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_scanned_meal(request):
    """
    Saves the final confirmed meal & food items from ScanState into PostgreSQL.
    """
    data = request.data
    meal_type = data.get('mealType', 'lunch')
    foods_data = data.get('foods', [])
    photo = request.FILES.get('photo')
    barcode = data.get('barcode')

    total_calories = sum(item.get('calories', 0) for item in foods_data)
    food_title = "Scanned Barcode Meal" if barcode and not photo else "Scanned Dish"

    meal = MealLog.objects.create(
        user=request.user,
        food_name=food_title,
        meal_type=meal_type,
        calories=total_calories,
        portion="1 plate",
        photo=photo,
        barcode=barcode
    )

    for item in foods_data:
        DetectedFoodItem.objects.create(
            meal=meal,
            name=item.get('name'),
            grams=item.get('grams', 100),
            calories=item.get('calories', 0),
            protein=item.get('protein', 0.0),
            carbs=item.get('carbs', 0.0),
            fat=item.get('fat', 0.0),
            confidence=item.get('confidence', 90)
        )

    return Response(MealLogSerializer(meal).data, status=status.HTTP_201_CREATED)


# 7. Daily Macro Summary Endpoint (For Home.tsx Dashboard)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def daily_summary(request):
    """
    Calculates today's total consumed calories and macros for Home.tsx dashboard.
    """
    today = now().date()
    today_meals = MealLog.objects.filter(user=request.user, created_at__date=today)

    total_calories = today_meals.aggregate(Sum('calories'))['calories__sum'] or 0

    # Aggregate macros from detected items today
    items_today = DetectedFoodItem.objects.filter(meal__in=today_meals)
    total_protein = items_today.aggregate(Sum('protein'))['protein__sum'] or 0.0
    total_carbs = items_today.aggregate(Sum('carbs'))['carbs__sum'] or 0.0
    total_fat = items_today.aggregate(Sum('fat'))['fat__sum'] or 0.0

    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    return Response({
        "calories_consumed": total_calories,
        "calorie_goal": profile.calorie_goal,
        "streak_days": profile.streak_days,
        "macros": {
            "protein": {"consumed": round(total_protein, 1), "total": profile.protein_goal},
            "carbs": {"consumed": round(total_carbs, 1), "total": profile.carbs_goal},
            "fat": {"consumed": round(total_fat, 1), "total": profile.fat_goal},
            "water": {"consumed": 2.0, "total": profile.water_goal},
        }
    })
```

---

## 8. URL Routing (`urls.py`)

Update `nutrilensback/mainback/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    register_user, UserProfileViewSet, WeightLogViewSet, MealLogViewSet,
    analyze_scan, save_scanned_meal, daily_summary
)

router = DefaultRouter()
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'weight', WeightLogViewSet, basename='weight')
router.register(r'meals', MealLogViewSet, basename='meals')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Authentication
    path('api/auth/register/', register_user, name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Nutrilens Features
    path('api/scan/analyze/', analyze_scan, name='analyze_scan'),
    path('api/meals/save-scanned/', save_scanned_meal, name='save_scanned_meal'),
    path('api/dashboard/daily-summary/', daily_summary, name='daily_summary'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## 9. Database Migrations & Test Server

1. Generate migration files and execute against PostgreSQL:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
2. Create an admin user:
   ```bash
   python manage.py createsuperuser
   ```
3. Run the development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

---

## 10. Integrating Frontend Zustand Store (`nutritionStore.ts`) with Backend APIs

In your React Native app (`app/src/store/nutritionStore.ts`), replace hardcoded mock calls with API fetch requests using `axios` or native `fetch`:

```typescript
// Example snippet inside nutritionStore.ts
import { API_BASE_URL } from '@/config';

// 1. Save Scanned Meal to Django Backend
saveScannedMealApi: async () => {
  const { scan } = get();
  const token = await getSecureAccessToken();

  const formData = new FormData();
  formData.append('mealType', scan.mealType);
  formData.append('foods', JSON.stringify(scan.foods));

  if (scan.capturedPhotoUri) {
    formData.append('photo', {
      uri: scan.capturedPhotoUri,
      name: 'meal.jpg',
      type: 'image/jpeg',
    } as any);
  }

  const response = await fetch(`${API_BASE_URL}/api/meals/save-scanned/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.ok) {
    const savedMeal = await response.json();
    get().resetScan();
    // Refresh dashboard stats
    get().fetchDailySummary();
  }
}
```
