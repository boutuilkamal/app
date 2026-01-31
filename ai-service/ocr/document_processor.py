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
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

            # If no text extracted (might be scanned PDF), try OCR
            if not text.strip():
                text = DocumentProcessor._ocr_pdf(content)

            return text.strip()
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

    @staticmethod
    def _ocr_pdf(content: bytes) -> str:
        """OCR a scanned PDF"""
        try:
            # Try to use pdf2image if available
            from pdf2image import convert_from_bytes
            import pytesseract
            
            images = convert_from_bytes(content)
            text = ""
            for image in images:
                text += pytesseract.image_to_string(image) + "\n"
            return text
        except ImportError:
            return "PDF appears to be scanned. Please install pdf2image and poppler for OCR support."
        except Exception as e:
            return f"OCR not available: {str(e)}"

    @staticmethod
    def _extract_from_image(content: bytes) -> str:
        """Extract text from image using OCR"""
        try:
            import pytesseract
            image = Image.open(io.BytesIO(content))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            text = pytesseract.image_to_string(image)
            return text.strip()
        except ImportError:
            # Fallback if pytesseract is not available
            return "Image OCR not available. Please install pytesseract."
        except Exception as e:
            raise Exception(f"Image OCR failed: {str(e)}")
