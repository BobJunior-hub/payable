# Payable Management System

A modern web application for managing company payables with role-based access control.

## Features

- **Three User Roles:**
  - **Viewer**: Can only view expenses and payment status
  - **Creator**: Can create new expense entries
  - **Payer**: Can mark expenses as paid and change payment status

- **Expense Views:**
  - Daily Expenses
  - Weekly Expenses
  - Monthly Expenses
  - Yearly Expenses

- **Dashboard:**
  - Statistics overview
  - Expense charts by category
  - Recent expenses list
  - Amount summaries

- **Features:**
  - Filter expenses by payment status
  - Responsive design
  - Modern UI with Tailwind CSS

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Users

- **Viewer**: `viewer@company.com` - View-only access
- **Creator**: `creator@company.com` - Can create expenses
- **Payer**: `payer@company.com` - Can create and mark expenses as paid

## Technology Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Recharts (for charts)
- Lucide React (for icons)

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── context/         # React context (Auth)
├── types/           # TypeScript types
└── data/            # Mock data
```

## License

MIT

