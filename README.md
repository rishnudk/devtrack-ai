# DevTrack AI — Smart Learning Tracker for Developers

![DevTrack AI](https://img.shields.io/badge/DevTrack-AI-blue?style=for-the-badge&logo=code&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)

A full-stack AI-powered learning tracker built for developers. Create topics, write or generate notes with AI, take quizzes, and track your progress — all in one place.

---

## 📸 Features

- 👤 **Authentication** — Secure signup/login with better-auth
- 📚 **Topics System** — Create, manage, and delete learning topics
- 📝 **Notes** — Add notes manually or generate them using AI
- 📊 **Progress Tracking** — Mark topics as Not Started / In Progress / Completed with a progress slider
- 🤖 **AI Integration** — Generate structured notes and quizzes powered by Groq (LLaMA 3.3)
- 🎯 **Interactive Quizzes** — Test your knowledge with AI-generated multiple choice questions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | better-auth |
| AI | Groq API (LLaMA 3.3 70B) via Vercel AI SDK |
| Package Manager | pnpm |

---

## 📁 Project Structure

```
devtrack-ai/
│
├── app/
│   ├── (auth)/                   # Login & Signup pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx            # Sidebar + header shell
│   │   ├── dashboard/page.tsx    # Overview with stats
│   │   ├── topics/
│   │   │   ├── page.tsx          # All topics list
│   │   │   └── [topicId]/page.tsx # Topic detail + notes
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...all]/        # better-auth handler
│   │   ├── topics/               # Topics CRUD
│   │   │   └── [topicId]/
│   │   │       └── notes/        # Notes CRUD
│   │   └── ai/
│   │       ├── generate-notes/   # AI note generation
│   │       └── generate-quiz/    # AI quiz generation
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── ui/                       # shadcn components
│   ├── topics/                   # TopicCard, CreateTopicDialog, ProgressControl
│   ├── notes/                    # NoteCard, AddNoteForm, GenerateNotesButton
│   ├── ai/                       # QuizModal
│   └── shared/                   # Sidebar, Header
│
├── lib/
│   ├── db/
│   │   ├── index.ts              # Drizzle client
│   │   └── schema.ts             # Database schema
│   ├── auth/
│   │   ├── index.ts              # better-auth server config
│   │   └── client.ts             # Auth client helpers
│   └── ai/
│       └── index.ts              # Groq AI client
│
├── hooks/
│   ├── useTopics.ts
│   └── useNotes.ts
│
├── types/index.ts
├── middleware.ts                  # Route protection
└── drizzle.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (local or [Neon](https://neon.tech) — free cloud option)
- [Groq API key](https://console.groq.com) — free, no credit card needed

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/devtrack-ai.git
cd devtrack-ai
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```bash
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/devtrack_ai"

# Better Auth
BETTER_AUTH_SECRET="your-random-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# AI — Groq (free at console.groq.com)
GROQ_API_KEY="your-groq-key-here"
```

To generate a `BETTER_AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set up the database

**Option A — Local PostgreSQL:**
```bash
psql -U postgres
CREATE DATABASE devtrack_ai;
\q
```

**Option B — Neon (recommended, free cloud DB):**
Go to [neon.tech](https://neon.tech) → create a project → copy the connection string into `DATABASE_URL`.

### 5. Push the database schema

```bash
pnpm db:push
```

### 6. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

---

## 🗄 Database Scripts

| Command | Description |
|---|---|
| `pnpm db:push` | Push schema changes directly to the database |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |

---

## 🤖 AI Features

DevTrack AI uses **Groq** with the **LLaMA 3.3 70B** model for:

### Generate Notes
- Click **Generate with AI** on any topic page
- Optionally specify a subtopic (e.g. `useState`, `JWT`, `indexes`)
- AI generates structured markdown notes with code examples
- Notes are saved with an AI badge indicator

### Generate Quiz
- Click **Take Quiz** on any topic page
- AI generates 5 multiple choice questions based on your notes
- Get instant feedback and explanations for each answer
- See your final score with a performance rating

---

## 📊 Database Schema

```
users
  └── topics (userId → users.id)
        └── notes (topicId → topics.id, userId → users.id)

sessions, accounts, verifications (managed by better-auth)
```

**Topic status:** `not_started` | `in_progress` | `completed`  
**Topic progress:** `0–100` (integer)  
**Note isAiGenerated:** `"true"` | `"false"` (string)

---

## 🔐 Authentication Flow

- Signup/Login handled by **better-auth** with email + password
- Sessions stored in PostgreSQL via Drizzle adapter
- Protected routes (`/dashboard`, `/topics`, `/settings`) redirect to `/login` if no session cookie
- Auth routes (`/login`, `/signup`) redirect to `/dashboard` if already logged in

---

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all environment variables from `.env.local`
4. Change `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to your production domain
5. Deploy

> Make sure to use a cloud database like [Neon](https://neon.tech) for production — local PostgreSQL won't work on Vercel.

---

## 📦 Key Dependencies

```json
{
  "better-auth": "^1.x",
  "drizzle-orm": "^0.31.x",
  "ai": "^4.x",
  "@ai-sdk/groq": "^1.x",
  "pg": "^8.x",
  "zod": "^3.x",
  "lucide-react": "^0.x",
  "date-fns": "^4.x",
  "sonner": "^1.x"
}
```

---

## 🛣 Roadmap

- [ ] Search across notes
- [ ] Export notes as PDF
- [ ] Quiz history and scoring trends
- [ ] Dark/light mode toggle
- [ ] AI chat assistant per topic
- [ ] Public topic sharing

---

## 📄 License

MIT License — feel free to use this project for learning or as a base for your own apps.

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [better-auth](https://better-auth.com)
- [Groq](https://groq.com)
- [Vercel AI SDK](https://sdk.vercel.ai)