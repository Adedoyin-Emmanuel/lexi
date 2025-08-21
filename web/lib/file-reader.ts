import mammoth from "mammoth";

declare global {
  interface Window {
    pdfjsLib: {
      getDocument: (options: { data: ArrayBuffer }) => {
        promise: Promise<PDFDocument>;
      };
    };
  }
}

interface PDFDocument {
  numPages: number;
  getPage: (pageNum: number) => Promise<PDFPage>;
}

interface PDFPage {
  getTextContent: () => Promise<{ items: Array<{ str: string }> }>;
}

export async function getTextFromPDF(file: File): Promise<string> {
  try {
    if (!window.pdfjsLib) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js";
      document.head.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
      .promise;
    const maxPages = pdf.numPages;

    let text = "";
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: { str: string }) => item.str)
        .join("\n");
      text += pageText + "\n";
    }

    return text.trim();
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error("Failed to read PDF file");
  }
}

export async function getTextFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("Error reading Word document:", error);
    throw new Error("Failed to read Word document");
  }
}

export async function getTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    return await getTextFromPDF(file);
  } else if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await getTextFromWord(file);
  } else if (fileType === "text/plain") {
    return await file.text();
  } else {
    throw new Error("Unsupported file type");
  }
}
