# AI Note-Taking App

A full-stack note-taking application with AI-powered content enhancement. Users can create, manage, and improve notes using integrated AI features such as summarization, clarity improvement, and tag generation.

## 🚀 Tech Stack

| Layer | Technologies |
|------|--------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form |
| Backend | Hono.js API Routes, Prisma ORM, MongoDB |
| Authentication | Better Auth |
| State Management | Zustand |
| AI Integration | Google GenAI (`@google/genai`) |

---

## ✨ Core Features

### Authentication
- Register and Login
- Protected routes
- Basic user profile

### Notes Management
- Create notes with title + rich text editor
- Edit and delete notes
- View list of notes
- Search notes by title

### AI Enhancements
- **Summarize Note:** Condense text into short summary
- **Improve Note:** Enhances clarity and grammar
- **AI Tags:** Automatically generate relevant topic tags

### UI/UX
- Built with **shadcn/ui** component system
- Fully responsive layout
- Light/Dark mode toggle


## 🧰 Requirements

- Node.js 18+
- monogoDB 
- Google GenAI API Key


## ⚙️ Setup Instructions

### 1. Clone Repository
git clone https://github.com/shivam4940x/AI-Note-Taking-App

### 2. Install Dependencies
npm install

### 3. Environment Variables
Create `.env` file:

DATABASE_URL="mongodb+srv://database_url"  
BETTER_AUTH_SECRET="your_secret_here"  
BETTER_AUTH_URL="your_project_url"  
PORT="Port_Number"  
GOOGLE_GENAI_API_KEY="your_google_genai_key"

### 4. Database Setup
npx prisma migrate dev

### 5. Start App
npm run dev



## 🧠 AI Integration

AI functionality is implemented with Google GenAI:

- Server-side secured API calls
- Error handling included
- Works directly on note content

### Features Available:
| Feature | Description |
|--------|-------------|
| Summarize | Generates short summary |
| Improve | Rewrites content for clarity and readability |
| Auto-Tag | Suggests relevant tags |

---

## ✅ What This Project Demonstrates

- Full-stack CRUD workflow
- Authentication + protected routing
- Server actions + API route integration
- Controlled form management & rich-text editing
- Clean component-based UI architecture
- Practical AI API usage



## 🧪 Basic Commands

| Action | Command |
|--------|---------|
| Start Dev Server | `npm run dev` |
| Build Production | `npm run build` |
| Run Production | `npm start` |

---


## 🌍 Deployment

Deploy frontend + backend on **Vercel**

Live Demo: https://ai-note-taking-app-rho.vercel.app/

---

## 📦 Repository

https://github.com/shivam4940x/AI-Note-Taking-App
---




