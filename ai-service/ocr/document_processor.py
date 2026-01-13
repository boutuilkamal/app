import io
from typing import Union, List
from PIL import Image
import PyPDF2

class DocumentProcessor:
    """Process different document types and extract text"""

    @staticmethod
    async def extract_text(content: bytes, content_type: str) -> str:
        """Extract text from various document formats"""
        try:
            if content_type == 'application/pdf':
                return DocumentProcessor._extract_from_pdf(content)
            elif content_type in ['image/png', 'image/jpeg', 'image/jpg']:
                return DocumentProcessor._extract_from_image(content)
            elif content_type in ['text/plain', 'text/csv']:
                return content.decode('utf-8')
            else:
                raise ValueError(f"Unsupported content type: {content_type}")
        except Exception as e:
            raise Exception(f"Failed to extract text: {str(e)}")

    @staticmethod
    def _extract_from_pdf(content: bytes) -> str:
        """Extract text from PDF"""
        try:
            pdf_file = io.BytesIO(content)
            reader = PyPDF2.PdfReader(pdf_file)

            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"

            return text.strip()
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

    @staticmethod
    def _extract_from_image(content: bytes) -> str:
        """Extract text from image using OCR"""
        try:
            # For production, use pytesseract
            # import pytesseract
            # image = Image.open(io.BytesIO(content))
            # text = pytesseract.image_to_string(image)
            # return text

            # Placeholder for now
            return "Image OCR extraction placeholder - install pytesseract in production"
        except Exception as e:
            raise Exception(f"Image OCR failed: {str(e)}")
