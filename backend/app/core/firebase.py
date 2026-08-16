"""
Firebase Admin Authentication Integration
Server-side token verification and identity provider adapter
"""

import json
from typing import Any, Dict, Optional
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from app.core.config import settings
from app.core.logging import logger

_firebase_initialized = False


def initialize_firebase() -> bool:
    global _firebase_initialized
    if _firebase_initialized or len(firebase_admin._apps) > 0:
        _firebase_initialized = True
        return True

    try:
        if settings.FIREBASE_SERVICE_ACCOUNT_JSON:
            cred_dict = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
            logger.info("Firebase Admin initialized with inline service account JSON.")
            return True
        elif settings.FIREBASE_CREDENTIALS_PATH:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
            logger.info(f"Firebase Admin initialized from file: {settings.FIREBASE_CREDENTIALS_PATH}")
            return True
        elif settings.FIREBASE_PROJECT_ID:
            firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
            _firebase_initialized = True
            logger.info(f"Firebase Admin initialized with project ID: {settings.FIREBASE_PROJECT_ID}")
            return True
    except Exception as e:
        logger.warning(f"Firebase Admin SDK initialization notice (using fallback mode): {e}")

    return False


def verify_firebase_id_token(token: str, check_revoked: bool = False) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token.
    Returns decoded token dictionary with user claims.
    """
    initialize_firebase()
    
    try:
        decoded = firebase_auth.verify_id_token(token, check_revoked=check_revoked)
        return decoded
    except Exception as e:
        # If in development or token is a mock token for local testing/demo
        if settings.DEBUG and (token.startswith("mock_") or token.startswith("user-") or token.startswith("test_")):
            return {
                "uid": token,
                "email": f"{token}@example.com" if "@" not in token else token,
                "name": "Demo Engineer",
                "email_verified": True,
                "auth_time": 1700000000,
            }
        logger.warning(f"Firebase token verification failed: {e}")
        raise ValueError(f"Invalid or expired token: {str(e)}")
