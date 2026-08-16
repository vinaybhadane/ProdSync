"""
Azure Service Bus Asynchronous Queue Integration
"""

import asyncio
import json
from typing import Any, Callable, Dict, Optional
from app.core.config import settings
from app.core.logging import logger

try:
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage
    from azure.identity.aio import DefaultAzureCredential
    SERVICE_BUS_AVAILABLE = True
except ImportError:
    SERVICE_BUS_AVAILABLE = False


class AzureServiceBusService:
    def __init__(self):
        self.conn_str = settings.AZURE_SERVICE_BUS_CONNECTION_STRING
        self.namespace = settings.AZURE_SERVICE_BUS_NAMESPACE
        self.queue_name = settings.AZURE_SERVICE_BUS_QUEUE_PROCESSING
        self.client: Optional[Any] = None
        self._local_queue = asyncio.Queue()

    async def get_client(self):
        if not SERVICE_BUS_AVAILABLE:
            return None
        if self.client:
            return self.client

        if self.conn_str and len(self.conn_str) > 10 and "Endpoint=" in self.conn_str:
            try:
                self.client = ServiceBusClient.from_connection_string(self.conn_str)
                return self.client
            except Exception as e:
                logger.warning(f"Service Bus client initialization: {e}")
        return None

    async def publish_job_message(self, job_payload: Dict[str, Any], queue_name: Optional[str] = None):
        """Publishes a processing job message with job_id and metadata."""
        target_queue = queue_name or self.queue_name
        message_body = json.dumps(job_payload)
        
        client = await self.get_client()
        if client:
            try:
                sender = client.get_queue_sender(queue_name=target_queue)
                async with sender:
                    message = ServiceBusMessage(message_body)
                    await sender.send_messages(message)
                logger.info(f"Published job to Azure Service Bus [{target_queue}]: {job_payload.get('job_id')}")
                return
            except Exception as e:
                logger.warning(f"Service Bus publish notice (using async local queue): {e}")

        # Local async queue fallback
        await self._local_queue.put(job_payload)
        logger.info(f"Enqueued job to local worker queue: {job_payload.get('job_id')}")

    async def receive_local_message(self) -> Dict[str, Any]:
        """Receives a message from the local background queue."""
        return await self._local_queue.get()


service_bus_service = AzureServiceBusService()
