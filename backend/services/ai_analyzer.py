import logging
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict

import joblib


PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODELS_DIR = PROJECT_ROOT / "sbackend" / "camplaint-analyzer" / "models"


def _load_model(model_name: str):
    model_path = MODELS_DIR / f"{model_name}_model.pkl"
    if not model_path.exists():
        raise FileNotFoundError(
            f"Model file '{model_path}' not found. "
            "Ensure sbackend models are trained and available."
        )
    logging.info("Loading %s model from %s", model_name, model_path)
    return joblib.load(model_path)


@lru_cache(maxsize=1)
def _load_models() -> Dict[str, Any]:
    if not MODELS_DIR.exists():
        raise FileNotFoundError(
            f"Models directory '{MODELS_DIR}' not found. "
            "Make sure sbackend is present with trained models."
        )

    return {
        "category": _load_model("category"),
        "priority": _load_model("priority"),
        "type": _load_model("type"),
        "department": _load_model("department"),
    }


def analyze_text(text: str) -> Dict[str, Any]:
    """Run AI analysis against the shared sbackend models."""
    if not text or not text.strip():
        raise ValueError("Complaint text cannot be empty.")

    models = _load_models()
    payload = [text]

    category = models["category"].predict(payload)[0]
    priority = models["priority"].predict(payload)[0]
    compl_type = models["type"].predict(payload)[0]
    department = models["department"].predict(payload)[0]

    proba = models["category"].predict_proba(payload)[0]
    confidence = round(float(proba.max()) * 100, 2)

    return {
        "category": category,
        "priority": priority,
        "type": compl_type,
        "assignedDepartment": department,
        "aiConfidence": confidence,
    }

