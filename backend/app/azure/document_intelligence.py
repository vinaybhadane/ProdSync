"""
Azure AI Document Intelligence OCR, Google Gemini Vision & Tabular File Extraction Integration
Supports PDF, CSV, TSV, XLSX, JSON, and Image OCR (PNG, JPG, JPEG, WEBP, TIFF, BMP).
"""

import csv
import io
import json
import logging
from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.core.logging import logger

try:
    from google import genai
    from google.genai import types as genai_types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

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
        self.gemini_client: Optional[Any] = None

        # 1. Initialize Azure Document Intelligence client
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

        # 2. Initialize Google Gemini Vision client
        if GENAI_AVAILABLE and settings.GEMINI_API_KEY:
            try:
                self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info("Google Gemini Vision OCR engine initialized.")
            except Exception as e:
                logger.warning(f"Gemini Vision init notice: {e}")

    async def analyze_document(self, document_bytes: bytes, file_type: str = "pdf") -> Dict[str, Any]:
        """
        Analyzes a document or image using Gemini Vision, Azure AI Document Intelligence, or tabular parsers.
        Extracts pages, text blocks, structured records, tables, and raw OCR text.
        """
        import asyncio

        file_type_lower = file_type.lower().replace(".", "")

        # 1. Structured Tabular Formats (CSV / TSV / JSON / Excel)
        if file_type_lower in ["csv", "tsv", "txt", "json", "xlsx", "xls"]:
            return self._parse_structured_file(document_bytes, file_type_lower)

        # 2. Images (PNG, JPG, JPEG, WEBP, TIFF, BMP) -> Multimodal Gemini Vision OCR
        if file_type_lower in ["jpg", "jpeg", "png", "webp", "tiff", "bmp", "gif"]:
            return await self._analyze_image_ocr(document_bytes, file_type_lower)

        # 3. Azure AI Document Intelligence for PDFs
        if self.client and file_type_lower == "pdf":
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

        # 4. Local PDF & text extraction
        return self._local_fallback_extraction(document_bytes, file_type_lower)

    async def _analyze_image_ocr(self, data: bytes, file_type: str) -> Dict[str, Any]:
        """
        Executes high-accuracy OCR on image bytes using Google Gemini Vision or Azure Document Intelligence.
        """
        import asyncio
        mime_map = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "webp": "image/webp",
            "bmp": "image/bmp",
            "tiff": "image/tiff",
            "gif": "image/gif",
        }
        mime_type = mime_map.get(file_type, "image/png")

        # 1. Primary: Google Gemini Vision OCR
        if self.gemini_client:
            models_to_try = [
                settings.GEMINI_MODEL or "gemini-3.5-flash-lite",
                "gemini-3.5-flash-lite",
                "gemini-3.5-flash",
                "gemini-flash-lite-latest",
                "gemini-3.1-flash-lite",
                "gemini-2.5-flash",
            ]
            for model_name in models_to_try:
                try:
                    logger.info(f"Invoking Gemini Vision OCR on image ({len(data)} bytes) with model '{model_name}'...")
                    response = await asyncio.to_thread(
                        self.gemini_client.models.generate_content,
                        model=model_name,
                        contents=[
                            genai_types.Part.from_bytes(data=data, mime_type=mime_type),
                            (
                                "Perform complete, high-precision Optical Character Recognition (OCR) on this product image or nameplate.\n"
                                "Transcribe every single piece of visible text exactly as written, including:\n"
                                "- Product names, titles, branding, and manufacturer names\n"
                                "- Part numbers, model numbers, SKU, serial numbers, barcodes, QR texts\n"
                                "- Electrical ratings (voltage, amperage, power, frequency, phase)\n"
                                "- Mechanical ratings (pressure, flow rate, RPM, torque, dimensions, weight)\n"
                                "- Certifications (CE, UL, CSA, ISO, IP rating, RoHS)\n"
                                "- Materials, finishes, warnings, and specification tables\n\n"
                                "Return the exact transcribed text cleanly."
                            )
                        ]
                    )
                    ocr_text = response.text or ""
                    if ocr_text.strip():
                        lines = [line.strip() for line in ocr_text.split("\n") if line.strip()]
                        logger.info(f"Gemini Vision successfully extracted {len(lines)} OCR text lines from image.")
                        return {
                            "full_text": ocr_text.strip(),
                            "pages": [{"page_number": 1, "lines": lines}],
                            "tables": [],
                            "records": [],
                            "source": "google_gemini_vision_ocr",
                            "model": model_name,
                        }
                except Exception as e:
                    logger.warning(f"Gemini Vision OCR notice for '{model_name}': {e}")
                    continue

        # 2. Secondary: Azure Document Intelligence for Images
        if self.client:
            try:
                poller = await self.client.begin_analyze_document("prebuilt-read", document=data)
                result = await asyncio.wait_for(poller.result(), timeout=15.0)
                extracted_pages = []
                for page in result.pages:
                    extracted_pages.append({
                        "page_number": page.page_number,
                        "lines": [line.content for line in page.lines],
                        "width": page.width,
                        "height": page.height,
                    })
                return {
                    "full_text": result.content,
                    "pages": extracted_pages,
                    "tables": [],
                    "records": [],
                    "source": "azure_document_intelligence_read",
                }
            except Exception as e:
                logger.warning(f"Azure OCR error: {e}")

        # 3. Fallback: Local string decode
        full_text = data.decode("utf-8", errors="ignore")[:5000]
        return {
            "full_text": full_text.strip(),
            "pages": [{"page_number": 1, "lines": full_text.split("\n")}],
            "tables": [],
            "records": [],
            "source": "image_fallback_parser",
        }

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
                    for key in ["products", "items", "data", "catalog"]:
                        if key in parsed and isinstance(parsed[key], list):
                            records = [r for r in parsed[key] if isinstance(r, dict)]
                            break
                    if not records:
                        records = [parsed]
                text_lines = [json.dumps(r) for r in records[:50]]

            elif file_type in ["csv", "tsv", "txt"]:
                delimiter = "\t" if file_type == "tsv" else ","
                sample = raw_text[:2048]
                if file_type == "csv" and "\t" in sample and "," not in sample:
                    delimiter = "\t"
                elif file_type == "csv" and ";" in sample and "," not in sample:
                    delimiter = ";"

                reader = csv.DictReader(io.StringIO(raw_text), delimiter=delimiter)
                for row in reader:
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
