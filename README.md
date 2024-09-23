# Dynamic User Availability and Event Scheduling System

This is a full-stack web application that allows users to set their availability dynamically and enables the admin to schedule sessions based on the users' availability. The system supports both one-on-one and multi-participant sessions, with a focus on creating a clean and intuitive user interface.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Design Decisions](#design-decisions)
- [Demo](#demo)
- [License](#license)

## Project Structure

The project is divided into two main parts: the client (frontend) and the server (backend). Below is an overview of the project structure:

```
availability-scheduling-system/
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── AvailabilityCalendar.tsx
│       │   ├── TimeSlotSelector.tsx
│       │   ├── Navbar.tsx
│       │   ├── UserList.tsx
│       │   ├── AdminCalendar.tsx
│       │   ├── SessionCreator.tsx
│       │   └── SessionsList.tsx
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── UserDashboard.tsx
│       │   └── AdminDashboard.tsx
│       ├── services/
│       │   └── api.ts
│       ├── types/
│       │   └── index.ts
│       ├── utils/
│       │   └── date.ts
│       ├── contexts/
│       │   ├── AuthContext.tsx
│       │   ├── UserContext.tsx
│       │   ├── AvailabilityContext.tsx
│       │   └── SessionContext.tsx
│       ├── App.tsx
│       └── index.tsx
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── availabilityController.ts
│   │   │   └── sessionController.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Availability.ts
│   │   │   └── Session.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── availabilities.ts
│   │   │   └── sessions.ts
│   │   ├── services/
│   │   │   └── emailService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── validation.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   └── app.ts
│   └── package.json
├── .gitignore
└── README.md
```

### Client (Frontend)

- **client/public/**: This directory contains static assets like images, fonts, and the `index.html` file used by React.
- **client/src/**: The main source code for the frontend.
  - **components/**: Reusable UI components such as buttons, forms, modals, etc.
  - **pages/**: Page-level components, representing different views like the availability input page, admin dashboard, etc.
  - **services/**: Handles API calls and interactions with the backend.
  - **types/**: TypeScript interfaces and types used throughout the frontend.
  - **utils/**: Utility functions that are reused across the frontend.
  - **App.tsx**: The root component that sets up the main routes and layout.
  - **index.tsx**: The entry point of the React application, rendering the `App` component.

### Server (Backend)

- **server/src/**: The main source code for the backend.
  - **controllers/**: Contains the business logic for handling API requests and interacting with models.
  - **models/**: Defines the database schema and models using Mongoose (for MongoDB).
  - **routes/**: Defines the API endpoints and maps them to the appropriate controllers.
  - **services/**: Contains services that handle complex business logic, such as availability conflict checks, session scheduling, etc.
  - **types/**: TypeScript interfaces and types used throughout the backend.
  - **utils/**: Utility functions that are reused across the backend, such as error handling, date formatting, etc.
  - **app.ts**: The main entry point of the server application, setting up middleware, routes, and starting the server.
- **server/package.json**: Lists the dependencies and scripts required to run the backend.

### Other Files

- **.gitignore**: Specifies files and directories that should be ignored by Git, such as `node_modules/` and environment files.
- **README.md**: This file, providing an overview of the project, setup instructions, and other essential details.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Ensure MongoDB is running on your system)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/availability-scheduling-system.git
   cd availability-scheduling-system

   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # For client
   cd client
   npm install

   # For server
   cd ../server
   npm install

   ```

3. Create a .env file in the server directory with the following content:

   ````makefile
   MONGO_URI=your_mongo_db_connection_string
   PORT=5000
   
   Run the application:
   
   # Start the server
   cd server
   npm start

   # Start the client
   cd ../client
   npm start

   Open your browser and navigate to http://localhost:3000.
   ````

### Usage

- User: Login using your email and set your availability by selecting time slots for specific days.
- Admin: Access the admin dashboard to view user availability, schedule sessions, and manage existing sessions.

### API Documentation

API documentation is available in the /server/docs directory (you can also use tools like Swagger if integrated).

### Features

- Dynamic availability input with flexible time intervals.
- Admin dashboard for viewing availability and scheduling sessions.
- Conflict detection for overlapping sessions.
- Intuitive and responsive UI/UX design.
- Session management with options to reschedule or cancel sessions.
- Notification preferences for users (BONUS).

### Design Decisions

- React & TypeScript: Chosen for a robust and scalable frontend with type safety.
- Node.js & Express: Used for backend due to its non-blocking architecture and ease of integrating with MongoDB.
- MongoDB: A NoSQL database, ideal for storing user availability and session data due to its flexibility in handling dynamic data.
