# Employee Performance Management System (EPMS)

## Overview
The Employee Performance Management System (EPMS) is a web-based platform designed to streamline and automate employee performance tracking, goal management, feedback collection, and review processes within an organization.

## Objectives
- Digitize employee performance evaluation workflows
- Enable managers to track goals and reviews efficiently
- Provide employees with transparent feedback and progress tracking
- Generate AI-based performance summaries for review assistance

## Features
- Employee Management
- Goal Tracking
- Performance Review Management
- Continuous Feedback Module
- Dashboard Analytics
- AI Summary Generation
- Role-Based Authentication

## Tech Stack
### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Vite

### Backend
- FastAPI
- Python

### Database
- PostgreSQL

### ORM / Tools
- SQLAlchemy
- Alembic
- Git / GitHub

## Project Structure
employee-performance-management-system/
├── frontend/
├── backend/
├── docs/
└── README.md

## Setup Instructions

### Frontend
```bash
npm install
npm run dev


Here is a clean, accurate, ready-to-run example using PaddleOCR to extract text from a single image.


---

1) Install Dependencies

pip install paddleocr paddlepaddle


---

2) OCR Script for One Image

from paddleocr import PaddleOCR

# Initialize OCR model once
ocr = PaddleOCR(
    use_angle_cls=True,   # Detect rotated text
    lang='en'             # OCR language
)

image_path = "image.png"   # Replace with your image path

# Run OCR
result = ocr.ocr(image_path, cls=True)

# Extract and print text
extracted_text = []

if result and result[0]:
    for line in result[0]:
        text = line[1][0]
        confidence = line[1][1]
        
        extracted_text.append(text)
        print(f"Text: {text} | Confidence: {confidence:.2f}")

print("\nFinal Extracted Text:")
print(" ".join(extracted_text))


---

Example Output

If the image contains:

> Employee Performance Report
Name: John Doe
Score: 92



Output will be roughly:

Text: Employee Performance Report | Confidence: 0.99
Text: Name: John Doe | Confidence: 0.98
Text: Score: 92 | Confidence: 0.97

Final Extracted Text:
Employee Performance Report Name: John Doe Score: 92


---

Notes

Replace "image.png" with your actual file path.

First run may take longer because the model downloads weights.

For non-English text, change lang='en' accordingly.



---

If you want structured output (e.g., preserve line breaks/paragraphs instead of joining into one line), I can show you how to format that next.




Good—this is exactly the kind of image **PaddleOCR handles well.

I’ll give you correct modules + clean working code to extract text from this type of image.


---

✅ 1. Install Correct Modules

Run this in terminal:

pip install paddlepaddle paddleocr opencv-python pillow


---

✅ 2. Working OCR Code (Accurate + Clean)

from paddleocr import PaddleOCR
import cv2

# Initialize OCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Load image
image_path = "test.png"   # <-- replace with your image name
img = cv2.imread(image_path)

# Run OCR
result = ocr.ocr(img, cls=True)

# Extract text line by line
extracted_text = []

for line in result[0]:
    text = line[1][0]
    confidence = line[1][1]
    
    extracted_text.append(text)
    print(f"{text} (Confidence: {confidence:.2f})")

# Final combined text
print("\n--- Final Extracted Text ---")
print("\n".join(extracted_text))


---

✅ 3. Expected Output from Your Image

From your uploaded image, OCR will roughly extract:

This is a lot of 12 point text to test the
ocr code and see if it works on all types
of file format.
The quick brown dog jumped over the ...

(Black boxes will appear as missing/uncertain text — that’s normal.)


---

✅ 4. Important Tips (VERY IMPORTANT ⚡)

Your image is slightly blurred + skewed, so accuracy improves if you preprocess:

Add this before OCR:

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Optional: threshold for better clarity
_, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

# Use processed image
result = ocr.ocr(thresh, cls=True)


---

✅ 5. Common Mistakes (Avoid These)

❌ Wrong path (image.png not found)

❌ Not installing paddlepaddle

❌ Using low-quality image

❌ Forgetting cls=True (important for rotated text)



---

🔥 Best Setup for Your Project

Since you're building backend systems:

Use PaddleOCR + FastAPI

Add preprocessing (OpenCV)

Store extracted text in PostgreSQL



---

If you want next step, I can help you:

👉 Extract structured data (Name, Date, etc.) from OCR
👉 Or build complete OCR API backend (production ready)