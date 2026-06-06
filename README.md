# 📌 Amity Notice Board

A full-stack Notice Board application built for **Amity University Lucknow**, supporting Create, Read, Update, and Delete (CRUD) operations on notices.

**Live Demo:** _[Add your Vercel URL here]_

---

## Features

- 🔵 **Blue Amity theme** — clean design inspired by Amity University Lucknow
- 📋 **Full CRUD** — create, view, edit, and delete notices
- 🔍 **Search** — filter notices by title or body text in real-time
- 🏷️ **Category filter** — filter by Exam, Event, or General with live counts
- 🔴 **Urgent priority** — urgent notices sort to the top with a red badge (database-ordered via Prisma `orderBy`, not JavaScript)
- 📄 **Notice detail page** — click "Read more" to view the full notice
- 💀 **Loading skeletons** — smooth loading state on first render
- ✅ **Toast notifications** — success/error feedback on all actions
- 🌙 **Dark mode toggle** — one-click dark/light theme
- 📱 **Fully responsive** — works on mobile and desktop
- ✅ **Server-side validation** — required fields and date validated in API routes
- 🖼️ **Optional image** — notices can include an image URL

---

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Framework | Next.js 14 (Pages Router)      |
| Database  | TiDB Cloud (MySQL-compatible)  |
| ORM       | Prisma 5                       |
| Styling   | CSS Modules                    |
| Hosting   | Vercel (Hobby tier)            |

---

## Running Locally

### Prerequisites
- Node.js v18+
- A free [TiDB Cloud](https://tidbcloud.com) cluster (or any MySQL/Postgres host)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/notice-board.git
cd notice-board

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL

# 4. Push schema to database
npx prisma db push

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```
DATABASE_URL=mysql://<user>:<password>@<host>:<port>/noticeboard?sslaccept=strict
```

---

## What I Would Improve With More Time

**Image uploads via Cloudinary or UploadThing** — currently the image field accepts a URL. With more time I'd integrate direct file upload so users can upload images from their device rather than pasting external links. This would make the app feel much more polished and self-contained.

---

## AI Usage

AI (Claude) was used to:
- Scaffold the initial Next.js project structure and Prisma schema
- Generate the base CSS module styles and responsive layout
- Debug a Prisma enum ordering issue (ascending `priority` puts "Urgent" before "Normal" alphabetically)
- Add features: search/filter, toast notifications, loading skeletons, dark mode, detail page
- Review and improve the README

All code was reviewed, understood, and tested by me. I can explain every part of the codebase.
