from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image
from rest_framework.test import APIRequestFactory, force_authenticate

from accounts.models import User
from .models import FoodAnalysis
from .views import FoodAnalysisView


class FoodAnalysisServiceAPITest(TestCase):
    def setUp(self):
        self.user = User.objects.create(email="test@example.com", first_name="Test", password="x")

    def image(self):
        image = Image.new("RGB", (2, 2), "red")
        from io import BytesIO
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        return SimpleUploadedFile("food.jpg", buffer.getvalue(), content_type="image/jpeg")

    @patch("food_analysis.views.FoodAnalysisService")
    def test_analysis_is_owned_by_authenticated_user(self, service):
        service.return_value.analyze.return_value = {
            "predictions": [{"label": "fried rice", "confidence": 0.92}],
            "detected_food": "fried rice",
            "confidence": 0.92,
            "raw_result": [{"label": "fried rice", "confidence": 0.92}],
        }
        request = APIRequestFactory().post("/api/food-analysis/analyze/", {"image": self.image()}, format="multipart")
        force_authenticate(request, user=self.user)
        response = FoodAnalysisView.as_view()(request)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(FoodAnalysis.objects.filter(user=self.user).exists())
