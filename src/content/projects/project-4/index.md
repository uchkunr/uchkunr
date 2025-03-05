---
title: "Vision shop"
description: "AI-powered tool that analyzes product images using Google Vision API and generates optimized e-commerce descriptions with OpenAI GPT. Streamlines product listing creation for online stores."
date: "Dec 01 2024"
repoURL: https://github.com/uchkunrakhimow/vision-shop
---

# VisionSHOP

AI-powered image analysis and product description generator for e-commerce platforms.

## Features

- Image analysis using Google Cloud Vision API
- AI-generated product descriptions with OpenAI GPT
- Multi-language support
- Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Google Cloud Vision API, OpenAI API

## Getting Started

### Prerequisites

- Node.js (v14+)
- Google Cloud account with Vision API enabled
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vision-shop.git
cd vision-shop
```

2. Install dependencies:

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Configure environment variables:
   Create `.env` in the server directory:

```
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
OPENAI_API_KEY=your-openai-key
```

### Running the Application

#### Development

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

#### Production

```bash
# Build frontend
cd client
npm run build

# Build and start backend
cd ../server
npm run build
npm start
```

## API Endpoints

- `POST /api/images/process`: Process image and generate description

## License

MIT License
