# ⚡ VAMP - Vibecoding Community Platform

<p align="center">
  <img src="public/vamp-logo.png" alt="VAMP Logo" width="120" />
</p>

<p align="center">
  <strong>The home for vibecoders — discover, learn, build, and get funded.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## ✨ Features

### For Vibecoders
- 🚀 **Submit Projects** - Showcase your AI-assisted creations
- 📊 **Build Your Profile** - Track your Vibe Score and climb the leaderboard
- 🎁 **Apply for Grants** - Get funded by sponsors
- 💬 **Community Forum** - Connect with other vibecoders
- 📚 **Resources** - Learn from curated tutorials and experts

### For Sponsors
- 💰 **Create Grants** - Fund innovative vibecoded projects
- 👀 **Review Applications** - Choose winners from applicants
- 📈 **Track Impact** - See the projects you've supported

### Platform Features
- 🔐 GitHub OAuth authentication
- 🔼 Upvoting system with Vibe Scores
- 💬 Nested comments on projects
- 🏷️ Categories and filtering
- 🔍 Search across projects and grants
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) with GitHub OAuth
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- GitHub OAuth App

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vamp.git
cd vamp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vamp"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 4. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** VAMP (Local)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

### 5. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL` - Your production PostgreSQL URL
   - `NEXTAUTH_SECRET` - Generate a new secret for production
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://vamp.vercel.app`)
   - `GITHUB_ID` - Create a new GitHub OAuth App for production
   - `GITHUB_SECRET` - From your production GitHub OAuth App

5. Deploy!

### Database Options for Production

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [PlanetScale](https://planetscale.com/)

### Update GitHub OAuth for Production

Create a new GitHub OAuth App with:
- **Homepage URL:** `https://your-domain.vercel.app`
- **Callback URL:** `https://your-domain.vercel.app/api/auth/callback/github`

## 📁 Project Structure

```
vamp/
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                 # Static assets
├── src/
│   ├── actions/           # Server actions
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # User dashboards
│   │   ├── forum/         # Community forum
│   │   ├── grants/        # Grants system
│   │   ├── project/       # Project pages
│   │   └── ...
│   ├── components/        # React components
│   │   ├── forum/         # Forum components
│   │   ├── grants/        # Grant components
│   │   ├── layout/        # Layout components
│   │   ├── projects/      # Project components
│   │   └── ui/            # UI components
│   └── lib/               # Utilities
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with vibes ⚡
- Inspired by the vibecoding movement pioneered by [Andrej Karpathy](https://twitter.com/karpathy) and [Riley Brown](https://youtube.com/@rileybrownai)

---

<p align="center">
  Made with ❤️ by leveragedMonk
</p>
