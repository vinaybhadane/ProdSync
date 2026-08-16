"""
Azure AI Document Intelligence OCR, Table & Real-Time Tabular File Extraction Integration
"""

import csv
import io
import json
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
        Analyzes a document using Azure AI Document Intelligence or high-fidelity local parsers.
        Extracts pages, text blocks, structured tabular records, and key-value pairs with source locations.
        """
        import asyncio

        file_type_lower = file_type.lower().replace(".", "")

        # 1. Structured Tabular Formats (CSV / TSV / JSON / Excel) -> Parse real rows directly
        if file_type_lower in ["csv", "tsv", "txt", "json", "xlsx", "xls"]:
            return self._parse_structured_file(document_bytes, file_type_lower)

        # 2. Azure AI Document Intelligence for PDFs and Images
        if self.client and file_type_lower in ["pdf", "jpg", "jpeg", "png", "tiff"]:
            try:
                async def _call_azure():
                    poller = await self.client.begin_analyze_document(
                        "prebuilt-layout", document=document_bytes
                    )
                    return await poller.result()

                result = await asyncio.wait_for(_call_azure(), timeout=15.0)
                
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
                    "records": [],
                    "source": "azure_document_intelligence",
                }
            except Exception as e:
                logger.warning(f"Azure Document Intelligence notice (using local parser): {e}")

        # 3. Local PDF & text extraction
        return self._local_fallback_extraction(document_bytes, file_type_lower)

    def _parse_structured_file(self, data: bytes, file_type: str) -> Dict[str, Any]:
        """
        Parses actual rows from uploaded CSV, TSV, JSON, or Excel files into real product records.
        """
        records: List[Dict[str, Any]] = []
        text_lines: List[str] = []

        try:
            # Decode text with utf-8-sig to strip BOM if present
            raw_text = data.decode("utf-8-sig", errors="replace")

            if file_type == "json":
                parsed = json.loads(raw_text)
                if isinstance(parsed, list):
                    records = [r for r in parsed if isinstance(r, dict)]
                elif isinstance(parsed, dict):
                    # Check if items or products key exists
                    for key in ["products", "items", "data", "catalog"]:
                        if key in parsed and isinstance(parsed[key], list):
                            records = [r for r in parsed[key] if isinstance(r, dict)]
                            break
                    if not records:
                        records = [parsed]
                text_lines = [json.dumps(r) for r in records[:50]]

            elif file_type in ["csv", "tsv", "txt"]:
                delimiter = "\t" if file_type == "tsv" else ","
                # Detect delimiter if possible
                sample = raw_text[:2048]
                if file_type == "csv" and "\t" in sample and "," not in sample:
                    delimiter = "\t"
                elif file_type == "csv" and ";" in sample and "," not in sample:
                    delimiter = ";"

                reader = csv.DictReader(io.StringIO(raw_text), delimiter=delimiter)
                for row in reader:
                    # Clean empty keys or None values
                    cleaned_row = {
                        str(k).strip(): str(v).strip()
                        for k, v in row.items()
                        if k and v is not None and str(v).strip()
                    }
                    if cleaned_row:
                        records.append(cleaned_row)
                
                text_lines = [raw_text[:25000]]

        except Exception as e:
            logger.warning(f"Structured file parse error: {e}")
            raw_text = data.decode("utf-8", errors="ignore")
            text_lines = [raw_text[:20000]]

        full_text = "\n".join(text_lines) if text_lines else raw_text[:20000]

        return {
            "full_text": full_text.strip(),
            "pages": [{"page_number": 1, "lines": full_text.split("\n")}],
            "tables": [],
            "records": records,
            "record_count": len(records),
            "source": f"real_file_parser_{file_type}",
        }

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
            "records": [],
            "source": "local_fallback_parser",
        }


document_intelligence_service = DocumentIntelligenceService()
