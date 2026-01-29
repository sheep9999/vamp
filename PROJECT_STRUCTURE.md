# VAMP - Vibecoding Community Platform
## Project Structure

```
vamp/
├── prisma/
│   └── schema.prisma              # Database schema
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx       # Sign in page
│   │   │   └── sign-up/
│   │   │       └── page.tsx       # Sign up page
│   │   │
│   │   ├── (main)/
│   │   │   ├── page.tsx           # Home/Trending page
│   │   │   ├── discover/
│   │   │   │   └── page.tsx       # Discover projects
│   │   │   ├── grants/
│   │   │   │   ├── page.tsx       # Grants listing
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Single grant detail
│   │   │   ├── forum/
│   │   │   │   └── page.tsx       # Community forum
│   │   │   ├── resources/
│   │   │   │   └── page.tsx       # Learning resources
│   │   │   └── project/
│   │   │       ├── new/
│   │   │       │   └── page.tsx   # Submit new project
│   │   │       └── [id]/
│   │   │           └── page.tsx   # Project detail page
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts   # NextAuth configuration
│   │   │   ├── projects/
│   │   │   │   ├── route.ts       # GET all, POST new
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts   # GET, PUT, DELETE single
│   │   │   │       └── upvote/
│   │   │   │           └── route.ts # POST upvote
│   │   │   ├── comments/
│   │   │   │   └── route.ts       # Comments CRUD
│   │   │   ├── grants/
│   │   │   │   └── route.ts       # Grants CRUD
│   │   │   └── users/
│   │   │       └── route.ts       # User operations
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles + Tailwind
│   │   └── providers.tsx          # Context providers wrapper
│   │
│   ├── components/
│   │   ├── ui/                    # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── ... (other shadcn components)
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx         # Main navigation
│   │   │   ├── footer.tsx         # Site footer
│   │   │   └── sidebar.tsx        # Optional sidebar
│   │   │
│   │   ├── projects/
│   │   │   ├── project-card.tsx   # Project display card
│   │   │   ├── project-list.tsx   # Projects grid/list
│   │   │   ├── project-form.tsx   # Submit/edit form
│   │   │   ├── upvote-button.tsx  # Upvote interaction
│   │   │   └── tech-stack-badge.tsx
│   │   │
│   │   ├── grants/
│   │   │   ├── grant-card.tsx     # Grant display card
│   │   │   └── grant-list.tsx     # Grants listing
│   │   │
│   │   ├── comments/
│   │   │   ├── comment-item.tsx   # Single comment
│   │   │   ├── comment-list.tsx   # Comments thread
│   │   │   └── comment-form.tsx   # Add comment
│   │   │
│   │   └── shared/
│   │       ├── search-bar.tsx     # Global search
│   │       ├── user-avatar.tsx    # User profile pic
│   │       ├── loading-spinner.tsx
│   │       └── empty-state.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # Auth helpers
│   │   ├── utils.ts               # Utility functions (cn, etc.)
│   │   └── validations.ts         # Zod schemas
│   │
│   ├── hooks/
│   │   ├── use-projects.ts        # Projects data hook
│   │   ├── use-upvote.ts          # Upvote mutation hook
│   │   └── use-debounce.ts        # Debounce utility hook
│   │
│   └── types/
│       └── index.ts               # TypeScript type definitions
│
├── public/
│   ├── fonts/                     # IBM Plex Mono font files
│   └── images/
│       └── vamp-logo.svg          # VAMP logo
│
├── .env                           # Environment variables
├── .env.example                   # Env template
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── README.md                      # Documentation
```

## Key Architecture Decisions

### Route Groups
- `(auth)` - Authentication pages (sign-in, sign-up)
- `(main)` - Main application pages with shared layout

### API Routes Pattern
- RESTful endpoints under `/api/`
- Each resource has its own folder with `route.ts`
- Dynamic routes for single resource operations

### Component Organization
- `ui/` - Reusable Shadcn/UI primitives
- `layout/` - Page structure components
- Feature-specific folders (projects, grants, comments)
- `shared/` - Cross-feature utilities

### State Management
- Server Components by default
- Client Components only where interactivity needed
- React Query for client-side data fetching
