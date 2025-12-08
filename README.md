🚗 Vehicle Rental System Backend API
A backend API for a vehicle rental management system that manages vehicle inventory with availability tracking, supports customer accounts and profiles, handles vehicle rentals, returns, and cost calculation, and provides secure role-based authentication for admin and customer users.

✨Technologies
Node.js
TypeScript
Express.js
PostgreSQL
bcrypt
JSON Web Tokens (JWT)
🚀Features
Manage vehicles with availability tracking
Customer profiles and account management
Rental bookings with cost calculations
Role-based authentication for Admins and Customers
Clean modular structure: routes, controllers, services
PostgreSQL database integration
📍The Process
I started this project by setting up a solid backend foundation using Express and TypeScript to keep the code strongly typed, modular, and easy to maintain. After establishing the environment and PostgreSQL integration, I built out the authentication system with JWT and bcrypt to handle secure signup and login for both admin and customer roles. From there, I implemented individual modules for users, vehicles, and bookings each split into routes, controllers, and services for clear separation of concerns. Business rules such as automatic vehicle availability updates, prevention of deletions when active bookings exist, and total price calculations were introduced and refined through continuous testing in Thunder Client. I also added role‑based visibility so that customers can only see and manage their own bookings, while admins can oversee the entire system. Finally, validation, error messaging, and user‑friendly responses (like notifying first‑time customers who have no bookings) were included to make the API polished, reliable, and production‑ready.

🚦 Running the Project
Clone the repository
Install dependencies: npm install
Set up Environment Variables: Create a .env file in the root directory with the following variables:
PORT=5000
DATABASE_URL=your_postgresql_DATABASE_URL
JWT_SECRET=your_jwt_secret_key 
Run development server: npm run dev
Open http://localhost:5000 in your browser
