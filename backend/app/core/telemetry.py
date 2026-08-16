"""
Azure Application Insights & OpenTelemetry Integration
"""

from app.core.config import settings
from app.core.logging import logger


def init_telemetry(app=None):
    """Initializes Azure Monitor / Application Insights OpenTelemetry instrumentation if configured."""
    if settings.APPLICATIONINSIGHTS_CONNECTION_STRING:
        try:
            from azure.monitor.opentelemetry import configure_azure_monitor
            configure_azure_monitor(
                connection_string=settings.APPLICATIONINSIGHTS_CONNECTION_STRING
            )
            logger.info("Azure Application Insights telemetry initialized successfully.")
        except Exception as e:
            logger.warning(f"Telemetry initialization failed: {e}")
    else:
        logger.info("Azure Application Insights not configured; using local structured logger.")
