# SmartHarvest

**SmartHarvest** is a full-stack platform that links farmers, foodbanks, and administrators through role-based dashboards, AI-driven insights, and secure IntaSend checkout flows.

## Why SmartHarvest?

- Farmers publish produce with real quantities, prices, and units.
- Foodbanks browse, forecast demand, and purchase directly from the dashboard.
- Admins track sales, usage stats, and manage every stakeholder.
- AI modules surface actionable demand predictions for faster decisions.
- Clerk handles authentication and role assignment end to end.

## Feature Highlights

**Farmer dashboard**

- Upload, edit, and archive produce listings.
- Monitor live inventory and pricing suggestions.
- Access AI demand advisor for smarter harvest planning.

**Foodbank dashboard**

- Browse available produce with filters and AI recommendations.
- Add items to an in-app cart and pay via IntaSend.
- Review historical purchases with farmer context and totals.

**Admin dashboard**

- Manage farmers, foodbanks, produce inventory, and permissions.
- Track revenue, purchase volumes, and AI usage insights.
- Audit activity with a unified analytics workspace.

**Shared**

- Responsive UI (Next.js + Tailwind).
- REST API (Node.js + Express) backed by MongoDB/Mongoose.
- Secure role gating with Clerk and consistent error handling middleware.

## Tech Stack

| Layer    | Technologies                       |
| -------- | ---------------------------------- |
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend  | Node.js, Express.js                |
| Database | MongoDB + Mongoose                 |
| Auth     | Clerk                              |
| Payments | IntaSend API                       |
| Tooling  | TypeScript, Axios, React hooks     |

## Quickstart

```bash
# 1. Clone
git clone https://github.com/your-username/smart-harvest.git
cd smart-harvest

# 2. Install dependencies
npm install && cd frontend && npm install && cd ..

# 3. Run MongoDB
mongod --dbpath ./data/db      # or connect to MongoDB Atlas

# 4. Start the dev servers
npm run dev        # backend (from repo root, if configured)
cd frontend && npm run dev
```

Visit `http://localhost:3000` for the Next.js app.

## Environment Variables

Create `.env` files for backend and frontend with the following keys:

```
MONGO_URI=your_mongo_connection_string
CLERK_API_KEY=your_clerk_api_key
CLERK_API_SECRET=your_clerk_api_secret
INTASEND_API_KEY=your_intasend_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Project Structure

```
smart-harvest
├─ backend
│  ├─ controllers
│  ├─ models
│  ├─ routes
│  └─ server.js
├─ frontend
│  ├─ app
│  │  ├─ dashboard
│  │  │  ├─ admin | farmer | foodbank
│  │  └─ components
│  └─ lib
├─ package.json
└─ README.md
```

## User Journeys

**Farmers**

1. Sign in with Clerk and open `/dashboard/farmer`.
2. Upload produce (name, quantity, unit, price).
3. Review AI insights to plan harvest and pricing.

**Foodbanks**

1. Sign in and open `/dashboard/foodbank`.
2. Browse produce, add to cart, and checkout via IntaSend.
3. Track historical purchases at `/dashboard/foodbank/purchases`.

**Admins**

1. Access `/dashboard/admin`.
2. Manage users, inventory, analytics, and AI stats.

## API Overview

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| GET    | `/produce`               | Retrieve all available produce      |
| POST   | `/produce`               | Create a new produce listing        |
| POST   | `/purchase/create`       | Create purchase + initiate IntaSend |
| GET    | `/purchase/user/:userId` | Fetch purchases for a specific user |

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/amazing-idea`.
3. Commit with context: `git commit -m "feat: add amazing idea"`.
4. Push and open a Pull Request.

## License

MIT License © 2025 — SmartHarvest Team
