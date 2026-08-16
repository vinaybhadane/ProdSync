"""
ProdSync Standard Error Hierarchy & Exception Handlers
"""

from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse


class ProdSyncException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class UnauthorizedException(ProdSyncException):
    def __init__(self, message: str = "Authentication required or token invalid"):
        super().__init__(
            code="UNAUTHORIZED",
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenException(ProdSyncException):
    def __init__(self, message: str = "Insufficient permissions or cross-tenant access denied"):
        super().__init__(
            code="FORBIDDEN",
            message=message,
            status_code=status.HTTP_403_FORBIDDEN
        )


class NotFoundException(ProdSyncException):
    def __init__(self, resource: str = "Resource", identifier: str = ""):
        message = f"{resource} '{identifier}' not found." if identifier else f"{resource} not found."
        super().__init__(
            code=f"{resource.upper().replace(' ', '_')}_NOT_FOUND",
            message=message,
            status_code=status.HTTP_404_NOT_FOUND
        )


class ValidationException(ProdSyncException):
    def __init__(self, message: str = "Validation failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            code="VALIDATION_FAILED",
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details
        )


class ConflictException(ProdSyncException):
    def __init__(self, message: str = "Resource conflict detected"):
        super().__init__(
            code="RESOURCE_CONFLICT",
            message=message,
            status_code=status.HTTP_409_CONFLICT
        )


class RateLimitException(ProdSyncException):
    def __init__(self, message: str = "Rate limit exceeded. Please retry later."):
        super().__init__(
            code="RATE_LIMIT_EXCEEDED",
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )


class APIQuotaExceededException(ProdSyncException):
    def __init__(self, message: str = "Google Gemini API rate limit or quota exceeded. Please wait a moment and try again, or check your API key quota."):
        super().__init__(
            code="AI_API_LIMIT_HIT",
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )


async def prodsync_exception_handler(request: Request, exc: ProdSyncException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req-unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id,
            }
        },
        headers={"X-Request-ID": request_id}
    )
