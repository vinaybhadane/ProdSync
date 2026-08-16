"""
Azure AI Document Intelligence OCR & Table Extraction Integration
"""

import io
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.core.logging import logger

try:
    from azure.ai.formrecognizer.aio import DocumentAnalysisClient
    from azure.core.credentials import AzureKeyCredential
    from azure.identity.aio import DefaultAzureCredential
    DOC_INTEL_AVAILABLE = True
except ImportError:
    DOC_INTEL_AVAILABLE = False


class DocumentIntelligenceService:
    def __init__(self):
        self.endpoint = settings.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT
        self.api_key = settings.AZURE_DOCUMENT_INTELLIGENCE_API_KEY
        self.client: Optional[Any] = None

        if DOC_INTEL_AVAILABLE and self.endpoint:
            try:
                if self.api_key:
                    self.client = DocumentAnalysisClient(
                        endpoint=self.endpoint,
                        credential=AzureKeyCredential(self.api_key),
                    )
                else:
                    self.client = DocumentAnalysisClient(
                        endpoint=self.endpoint,
                        credential=DefaultAzureCredential(),
                    )
                logger.info("Azure AI Document Intelligence client initialized.")
            except Exception as e:
                logger.warning(f"Azure AI Document Intelligence client notice: {e}")

    async def analyze_document(self, document_bytes: bytes, file_type: str = "pdf") -> Dict[str, Any]:
        """
        Analyzes a document using Azure AI Document Intelligence layout model.
        Extracts pages, text blocks, tables, and key-value pairs with source locations.
        """
        import asyncio

        if self.client and file_type.lower() in ["pdf", "jpg", "jpeg", "png", "tiff"]:
            try:
                async def _call_azure():
                    poller = await self.client.begin_analyze_document(
                        "prebuilt-layout", document=document_bytes
                    )
                    return await poller.result()

                result = await asyncio.wait_for(_call_azure(), timeout=12.0)
                
                extracted_pages = []
                for page in result.pages:
                    extracted_pages.append({
                        "page_number": page.page_number,
                        "lines": [line.content for line in page.lines],
                        "width": page.width,
                        "height": page.height,
                    })

                extracted_tables = []
                for table in result.tables:
                    table_cells = []
                    for cell in table.cells:
                        table_cells.append({
                            "row_index": cell.row_index,
                            "column_index": cell.column_index,
                            "content": cell.content,
                        })
                    extracted_tables.append({
                        "row_count": table.row_count,
                        "column_count": table.column_count,
                        "cells": table_cells,
                    })

                return {
                    "full_text": result.content,
                    "pages": extracted_pages,
                    "tables": extracted_tables,
                    "source": "azure_document_intelligence",
                }
            except Exception as e:
                logger.warning(f"Azure Document Intelligence error (using fallback parser): {e}")

        # Local fallback document extraction (e.g. for PDFs using pypdf or text parser)
        return self._local_fallback_extraction(document_bytes, file_type)

    def _local_fallback_extraction(self, data: bytes, file_type: str) -> Dict[str, Any]:
        full_text = ""
        pages = []
        
        if file_type.lower() == "pdf":
            try:
                import pypdf
                reader = pypdf.PdfReader(io.BytesIO(data))
                for i, page in enumerate(reader.pages):
                    text = page.extract_text() or ""
                    full_text += f"\n--- Page {i+1} ---\n" + text
                    pages.append({
                        "page_number": i + 1,
                        "lines": text.split("\n"),
                    })
            except Exception as e:
                full_text = data.decode("utf-8", errors="ignore")
                pages = [{"page_number": 1, "lines": full_text.split("\n")}]
        else:
            full_text = data.decode("utf-8", errors="ignore")
            pages = [{"page_number": 1, "lines": full_text.split("\n")}]

        return {
            "full_text": full_text.strip(),
            "pages": pages,
            "tables": [],
            "source": "local_fallback_parser",
        }


document_intelligence_service = DocumentIntelligenceService()
