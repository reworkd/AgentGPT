import difflib
import io
import re
from typing import List

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase


class DiffPDFInput(BlockIOBase):
    original: str
    updated: str


class DiffPDFOutput(BlockIOBase):
    file_url: str


class DiffPDF(Block):
    type = "DiffPDF"
    description = "Create a PDF that shows the difference between two bodies of text"
    input: DiffPDFInput

    async def run(self, workflow_id: str) -> DiffPDFOutput:
        with io.BytesIO() as diff_pdf_file:
            diffs = get_diff(self.input.original, self.input.updated)
            diff_pdf_file = get_diff_pdf(diffs, diff_pdf_file)
            print(diff_pdf_file)

            return DiffPDFOutput(file_url="# TODO: Save file to S3 and return the URL")


def get_diff(original: str, updated: str) -> List[str]:
    differ = difflib.Differ()
    words1: List[str] = re.findall(r"\b\w[\w-]*\b|\S", original, re.UNICODE)
    words2: List[str] = re.findall(r"\b\w[\w-]*\b|\S", updated, re.UNICODE)

    return list(differ.compare(words1, words2))


def get_diff_pdf(diff_list: List[str], in_memory_file: io.BytesIO) -> io.BytesIO:
    """
    Create a PDF that shows the difference between two bodies of text
    Each element of diff_list is a string of type "  word", "- word", or "+ word"
    """
    in_memory_file = io.BytesIO()

    c = canvas.Canvas(in_memory_file, pagesize=letter)
    width, height = letter

    text_obj = c.beginText()
    text_obj.setTextOrigin(10, height - 50)  # Place text at the top of the canvas/page

    for word in diff_list:
        if word.startswith("  "):
            # Black for normal text
            text_obj.setFillColorRGB(0, 0, 0)
            text_obj.textOut(word[2:] + " ")
        elif word.startswith("- "):
            # Darker red for deleted words
            text_obj.setFillColorRGB(0.5, 0, 0)
            text_obj.textOut(word[2:] + " ")
        elif word.startswith("+ "):
            # Darker green for added words
            text_obj.setFillColorRGB(0, 0.5, 0)
            text_obj.textOut(word[2:] + " ")
        else:
            continue

    c.drawText(text_obj)
    c.save()

    in_memory_file.seek(0)
    return in_memory_file
