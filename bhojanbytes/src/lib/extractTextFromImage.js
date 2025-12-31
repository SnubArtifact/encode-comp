import Tesseract from "tesseract.js";

export async function extractTextFromImage(base64Image) {
  const result = await Tesseract.recognize(
    base64Image,
    "eng",
    { logger: () => {} }
  );

  return result.data.text;
}
