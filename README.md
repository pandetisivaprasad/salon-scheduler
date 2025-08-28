# Salon Scheduler

A simple full-stack web application for managing salon appointments.

## Features
- Book new appointments
- View all scheduled appointments
- Backend: Node.js, Express, SQLite
- Frontend: React

## Project Structure
```
backend/
  server.js         # Express API server
  salon.db          # SQLite database
  package.json      # Backend dependencies
frontend/
  src/              # React source code
    App.js          # Main React component
    index.js        # React entry point
  public/
    index.html      # HTML template
  package.json      # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js and npm installed

### Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```sh
   cd backend
   npm install
   node server.js
   ```
   The backend will run on [http://localhost:4000](http://localhost:4000).

### Frontend Setup
1. Open another terminal and navigate to the `frontend` folder:
   ```sh
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000).

## Usage
- Open the frontend in your browser.
- Book appointments and view the list of all bookings.

## Commands to Start & Stop Services 
   ```sh
   cd backend
   node server.js
   cd ../frontend
   npm start
   ```
   ```sh
   lsof -ti :4000 | xargs kill -9
   lsof -ti :3000 | xargs kill -9
   ```


## License
MIT
