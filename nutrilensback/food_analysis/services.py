from __future__ import annotations

from typing import Any

from django.conf import settings
from huggingface_hub import InferenceClient


class FoodAnalysisServiceError(Exception):
    """Safe, client-facing category for an inference failure."""


class FoodAnalysisService:
    """Identify food in an image using Hugging Face Inference Providers."""

    def __init__(self):
        self.token = settings.HF_TOKEN
        self.model = settings.HF_FOOD_MODEL
        if not self.token:
            raise FoodAnalysisServiceError("Hugging Face is not configured.")
        client_kwargs = {
            "model": self.model,
            "token": self.token,
            "timeout": settings.HF_TIMEOUT,
        }
        if settings.HF_PROVIDER:
            client_kwargs["provider"] = settings.HF_PROVIDER
        self.client = InferenceClient(**client_kwargs)

    @staticmethod
    def _normalize(results: Any) -> dict[str, Any]:
        if not isinstance(results, (list, tuple)):
            raise FoodAnalysisServiceError("The model returned an invalid response.")

        predictions = []
        for result in results:
            label = getattr(result, "label", None)
            score = getattr(result, "score", None)
            if isinstance(result, dict):
                label = result.get("label")
                score = result.get("score")
            if not isinstance(label, str) or not label.strip():
                continue
            try:
                score = float(score)
            except (TypeError, ValueError):
                continue
            if not 0 <= score <= 1:
                continue
            predictions.append({"label": label.strip(), "confidence": score})

        if not predictions:
            raise FoodAnalysisServiceError("The model returned no valid predictions.")
        predictions.sort(key=lambda item: item["confidence"], reverse=True)
        return {
            "predictions": predictions,
            "detected_food": predictions[0]["label"],
            "confidence": predictions[0]["confidence"],
        }

    def analyze(self, image_file) -> dict[str, Any]:
        try:
            image_file.seek(0)
            response = self.client.image_classification(
                image=image_file,
                model=self.model,
            )
            normalized = self._normalize(response)
            # This is intentionally the normalized provider result, not a token
            # or client object, so it is safe to persist as JSON.
            normalized["raw_result"] = normalized["predictions"]
            return normalized
        except FoodAnalysisServiceError:
            raise
        except Exception as exc:
            raise FoodAnalysisServiceError("Food recognition is temporarily unavailable.") from exc
