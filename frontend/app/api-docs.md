SmartHarvest Frontend -> Backend API expectations

Base: NEXT_PUBLIC_API_BASE (defaults to http://localhost:5000/api)

1. POST /set-role
   Body: { userId, role }
   Action: Backend uses Clerk Server SDK to update publicMetadata.role for the user.
   Response: { success: true } on success

2. POST /produce
   Body: { type, quantity, location, farmerId }
   Action: Save to DB and return saved doc
   Response: { ...savedProduce }

3. GET /produce
   Response: [ { _id, type, quantity, location, farmerId, createdAt } ]

4. POST /ai/recommend
   Body: { farmerData } or { demandData }
   Action: Backend calls OpenAI (or other LLM) using your secret key and returns { recommendation: string }
   Response: { recommendation: "..." }

5. POST /payments/intasend/create-checkout
   Body: { userId, planId }
   Action: Backend creates IntaSend checkout session and returns { checkoutUrl } or { sessionId }
   Response: { checkoutUrl: "https://..." }

6. GET /payments/intasend/status?userId=...
   Response: { status: "active" | "inactive" | "past_due", plan: "monthly" }
