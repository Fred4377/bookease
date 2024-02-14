# BookEase 📅

A simple, fast, and responsive booking platform I built to help local businesses manage their appointments online instead of using WhatsApp and messy notebooks.

## What it does
BookEase allows customers to view available services, check real-time availability for specific dates, and book appointments. It also has a basic admin dashboard for the business owner to see their daily schedule and manage bookings.

## Tech Stack
* **Frontend:** React, Vite, React Router
* **Backend:** Node.js, Express
* **Database:** MongoDB & Mongoose
* **Styling:** Custom CSS (I mixed grid and flexbox, hand-coded most of it so it feels organic)

## Why I built this
I know a few barbers and salon owners here in Nairobi who literally run their entire booking system on a physical notepad. It gets messy when someone cancels or reschedules. I wanted to build something super lightweight they could just share a link to. It's a work in progress but the core flow is there!

## Known Issues (// TODOs)
- M-Pesa integration isn't fully wired up yet (currently just takes the booking and leaves it pending).
- The date picker looks a bit weird on super small screens (iPhone SE).
- The backend date parsing logic is a bit brittle, definitely need to refactor `getStartAndEndOfDay` later.

## Setup
If you want to run this locally:

1. Clone the repo
2. Add your `.env` in the backend folder (you'll need `MONGO_URI` and `JWT_SECRET`)
3. Run `npm install` in both `/bookease-backend` and `/bookease-frontend`
4. Run `npm run dev` in both folders

---
*Built with ❤️ and way too much coffee.*
