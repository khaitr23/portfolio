# Keegan Tran | Portfolio

Personal portfolio and CMS built with Next.js, Framer Motion, and Tailwind CSS.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion v12
- **Icons**: Lucide React
- **Content**: JSON flat-file CMS (`data/content.json`)
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin CMS

A password-protected editor is available at `/admin`. It lets you edit all portfolio content (hero, about, experience, projects, skills, and contact) without touching code. Changes are written directly to `data/content.json` via a Next.js Server Action.

## Project Structure

```
├── app/
│   ├── page.tsx              # Main portfolio page
│   ├── layout.tsx            # Root layout + fonts
│   ├── globals.css           # Global styles + keyframes
│   └── admin/                # CMS editor (password-protected)
├── components/               # Section components (Hero, About, Projects, etc.)
├── data/
│   └── content.json          # All portfolio content
├── lib/
│   ├── content.ts            # TypeScript types + data loader
│   └── toast.ts              # Global toast event helper
└── public/                   # Static assets (favicon, etc.)
```

## Features

- Typewriter animation on section headings and hero name
- Interactive canvas with lazy cursor-following particle effect in the hero
- Drag-to-reorder for projects, experience, skills, and coursework in the admin
- Project case study modal with problem / solution / results breakdown
- Hide/show individual projects from the admin without deleting them
- Global toast notification system for clipboard and email interactions
- Fully responsive
