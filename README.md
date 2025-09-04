# Not final README !!!

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Package Manager**: Bun

## How to Run

### Prerequisites

- Node.js 18+ or Bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/PrakharSinghOnGit/cloud-burst-prediction.git
   cd cloud-burst-pridiction
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```
   bun run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
