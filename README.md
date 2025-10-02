# mcss-club-2026

A Next.js application built with TypeScript and Tailwind CSS for the MCSS Club 2026.

## Project Structure

```
mcss-club-2026/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── hello/        # Example API endpoint
│   ├── globals.css       # Global styles with Tailwind directives
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/            # Reusable React components
│   └── Button.tsx        # Example button component
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/utmmcss/mcss-club-2026.git
cd mcss-club-2026
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - UI library

## Project Features

- ✅ TypeScript configuration for type safety
- ✅ Tailwind CSS for styling
- ✅ Next.js App Router with organized folder structure
- ✅ API routes in `app/api/` directory
- ✅ Reusable components in `components/` directory
- ✅ ESLint for code quality
- ✅ Dark mode support

## API Endpoints

- `GET /api/hello` - Example API endpoint that returns a JSON response

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
