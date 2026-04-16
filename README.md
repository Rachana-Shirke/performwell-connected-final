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