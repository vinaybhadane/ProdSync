"""
Azure Blob Storage Integration & Direct Upload SAS Generator
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
from app.core.config import settings
from app.core.logging import logger

try:
    from azure.storage.blob import (
        BlobSasPermissions,
        BlobServiceClient,
        generate_blob_sas,
    )
    from azure.identity import DefaultAzureCredential
    AZURE_STORAGE_AVAILABLE = True
except ImportError:
    AZURE_STORAGE_AVAILABLE = False


class AzureBlobService:
    def __init__(self):
        self.account_name = settings.AZURE_STORAGE_ACCOUNT_NAME
        self.conn_str = settings.AZURE_STORAGE_CONNECTION_STRING
        self.raw_container = settings.AZURE_STORAGE_CONTAINER_RAW
        self.processed_container = settings.AZURE_STORAGE_CONTAINER_PROCESSED
        self.exports_container = settings.AZURE_STORAGE_CONTAINER_EXPORTS
        self.client: Optional[BlobServiceClient] = None

        if AZURE_STORAGE_AVAILABLE:
            if self.conn_str:
                try:
                    self.client = BlobServiceClient.from_connection_string(self.conn_str)
                    logger.info("Azure Blob Storage client initialized with connection string.")
                except Exception as e:
                    logger.warning(f"Azure Blob initialization notice: {e}")
            elif self.account_name:
                try:
                    account_url = f"https://{self.account_name}.blob.core.windows.net"
                    credential = DefaultAzureCredential()
                    self.client = BlobServiceClient(account_url, credential=credential)
                    logger.info("Azure Blob Storage initialized with DefaultAzureCredential.")
                except Exception as e:
                    logger.warning(f"Azure Blob with Managed Identity notice: {e}")

    def generate_upload_sas(
        self,
        organization_id: str,
        filename: str,
        container: str = "prod-sync-raw",
        expiry_hours: int = 1,
    ) -> Tuple[str, str]:
        """
        Generates a short-lived, scoped SAS upload URL for direct client-to-blob upload.
        Returns: (sas_upload_url, logical_blob_path)
        """
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        safe_filename = "".join(c for c in filename if c.isalnum() or c in "._-")
        blob_path = f"org_{organization_id}/{timestamp}_{safe_filename}"

        if self.client and self.account_name:
            try:
                sas_token = generate_blob_sas(
                    account_name=self.account_name,
                    container_name=container,
                    blob_name=blob_path,
                    permission=BlobSasPermissions(write=True, create=True),
                    expiry=datetime.now(timezone.utc) + timedelta(hours=expiry_hours),
                )
                url = f"https://{self.account_name}.blob.core.windows.net/{container}/{blob_path}?{sas_token}"
                return url, blob_path
            except Exception as e:
                logger.warning(f"Failed to generate Azure SAS: {e}")

        # Local fallback upload URL for local dev
        local_url = f"/api/v1/imports/local-upload?path={blob_path}"
        return local_url, blob_path

    async def upload_bytes(
        self, data: bytes, blob_path: str, container: str = "prod-sync-raw", content_type: str = "application/octet-stream"
    ) -> str:
        """Uploads raw bytes to Azure Blob Storage asynchronously."""
        import asyncio

        if self.client:
            try:
                def _sync_upload():
                    container_client = self.client.get_container_client(container)
                    if not container_client.exists():
                        container_client.create_container()
                    blob_client = container_client.get_blob_client(blob_path)
                    blob_client.upload_blob(data, overwrite=True, content_type=content_type)
                    return blob_client.url

                return await asyncio.to_thread(_sync_upload)
            except Exception as e:
                logger.warning(f"Azure Blob upload notice (saving locally): {e}")

        # Local storage fallback
        local_dir = os.path.join("./storage", container, os.path.dirname(blob_path))
        os.makedirs(local_dir, exist_ok=True)
        local_file = os.path.join("./storage", container, blob_path)
        with open(local_file, "wb") as f:
            f.write(data)
        return local_file

    async def download_bytes(self, blob_path: str, container: str = "prod-sync-raw") -> bytes:
        """Downloads raw bytes from Azure Blob Storage or local storage asynchronously."""
        import asyncio

        if self.client:
            try:
                def _sync_download():
                    container_client = self.client.get_container_client(container)
                    blob_client = container_client.get_blob_client(blob_path)
                    return blob_client.download_blob().readall()

                return await asyncio.to_thread(_sync_download)
            except Exception as e:
                logger.warning(f"Azure Blob download notice: {e}")

        local_file = os.path.join("./storage", container, blob_path)
        if os.path.exists(local_file):
            with open(local_file, "rb") as f:
                return f.read()
        return b""


blob_service = AzureBlobService()
