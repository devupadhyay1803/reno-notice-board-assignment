# Amity Notice Board

A Notice Board application built for the Reno Platforms Web Development Internship Assignment using Next.js, Prisma, TiDB Cloud, and Vercel.

## Live Demo

https://reno-notice-board-assignment-de3x.vercel.app/

## GitHub Repository

https://github.com/devupadhyay1803/reno-notice-board-assignment

## Features

* Create notices
* View notices
* Edit notices
* Delete notices with confirmation
* Search notices
* Category filtering
* Dark mode toggle
* Responsive design
* TiDB Cloud database persistence

## Tech Stack

* Next.js (Pages Router)
* React
* Prisma ORM
* TiDB Cloud (MySQL-compatible)
* Vercel

## Run Locally

1. Clone the repository

```bash
git clone https://github.com/devupadhyay1803/reno-notice-board-assignment.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add:

```env
DATABASE_URL=your_tidb_connection_string
```

4. Push the Prisma schema

```bash
npx prisma db push
```

5. Start the development server

```bash
npm run dev
```

## One Improvement With More Time

I would add image uploads for notices using cloud storage and implement pagination for handling a large number of notices efficiently.

## AI Usage

AI tools were used for debugging, troubleshooting deployment issues, understanding Prisma and TiDB configuration, and improving the user interface. All code was reviewed, tested, and integrated manually.
