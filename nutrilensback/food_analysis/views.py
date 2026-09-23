from django.db import DatabaseError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FoodAnalysis
from .serializers import (
    FoodAnalysisConfirmationSerializer,
    FoodAnalysisSerializer,
    FoodAnalysisUploadSerializer,
)
from .services import FoodAnalysisService, FoodAnalysisServiceError


class FoodAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        upload_serializer = FoodAnalysisUploadSerializer(data=request.data)
        upload_serializer.is_valid(raise_exception=True)
        image = upload_serializer.validated_data["image"]
        try:
            analysis = FoodAnalysis.objects.create(user=request.user, image=image)
        except DatabaseError:
            return Response(
                {"detail": "The analysis could not be saved."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            result = FoodAnalysisService().analyze(image)
        except FoodAnalysisServiceError as exc:
            analysis.status = FoodAnalysis.FAILED
            analysis.error_message = str(exc)
            analysis.save(update_fields=["status", "error_message", "updated_at"])
            return Response(
                {"id": analysis.id, "status": analysis.status, "detail": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        analysis.detected_food = result["detected_food"]
        analysis.confidence = result["confidence"]
        analysis.predictions = result["predictions"]
        analysis.raw_result = result["raw_result"]
        analysis.status = FoodAnalysis.COMPLETED
        analysis.save(update_fields=[
            "detected_food", "confidence", "predictions", "raw_result", "status", "updated_at"
        ])
        return Response(FoodAnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED)


class FoodAnalysisHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = FoodAnalysis.objects.filter(user=request.user)
        return Response(FoodAnalysisSerializer(analyses, many=True).data)


class FoodAnalysisDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        return FoodAnalysis.objects.filter(user=request.user, pk=pk).first()

    def get(self, request, pk):
        analysis = self.get_object(request, pk)
        if analysis is None:
            return Response({"detail": "Analysis not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(FoodAnalysisSerializer(analysis).data)

    @transaction.atomic
    def post(self, request, pk):
        analysis = self.get_object(request, pk)
        if analysis is None:
            return Response({"detail": "Analysis not found."}, status=status.HTTP_404_NOT_FOUND)
        if analysis.status not in (FoodAnalysis.COMPLETED, FoodAnalysis.CONFIRMED):
            return Response({"detail": "Only a completed analysis can be confirmed."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FoodAnalysisConfirmationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        for field, value in serializer.validated_data.items():
            setattr(analysis, field, value)
        analysis.status = FoodAnalysis.CONFIRMED
        analysis.confirmed_at = timezone.now()
        analysis.save(update_fields=["detected_food", "estimated_portion_grams", "status", "confirmed_at", "updated_at"])
        return Response(FoodAnalysisSerializer(analysis).data)
