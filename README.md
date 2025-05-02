# MFlix Movie App

A simple React/Node.js application that connects to MongoDB's sample_mflix dataset to display movie information and comments.

## Project Structure

```
mflix-movie-app/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Comments.js
│   │   │   ├── MovieDetail.js
│   │   │   ├── MovieList.js
│   │   │   └── Navbar.js
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env                      # Environment variables (from your uploaded file)
├── .env.example              # Example environment file
├── package.json              # Server dependencies
├── README.md                 # This file
└── server.js                 # Express server
```

## Features

- View a list of movies with pagination
- Click on a movie to see its details
- View comments associated with a movie
- Simple and clean user interface

## Setup Instructions for Windows

### Prerequisites

1. Node.js (v14+ recommended)
2. npm (comes with Node.js)
3. MongoDB Atlas account with access to the sample_mflix dataset
4. Git (optional but recommended)

### Installation Steps

1. **Clone or download the project**

   ```
   git clone <repository-url>
   ```
   
   Or download and extract the zip file.

2. **Navigate to the project directory**

   ```
   cd mflix-movie-app
   ```

3. **Set up environment variables**

   - Rename your uploaded `.env` file to the project root directory or create one based on `.env.example`
   - Ensure the MongoDB connection string in the `.env` file is correct

4. **Install server dependencies**

   ```
   npm install
   ```

5. **Install client dependencies**

   ```
   npm run client-install
   ```

6. **Run the application in development mode**

   ```
   npm run dev
   ```

   This will start both the backend server (on port 5000) and the React development server (on port 3000).

7. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Running in Production Mode

1. **Build the React frontend**

   ```
   cd client
   npm run build
   ```

2. **Start the server**

   ```
   cd ..
   npm start
   ```

3. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Troubleshooting

- **MongoDB Connection Issues**
  - Ensure your MongoDB connection string is correct in the `.env` file
  - Check if your IP address is whitelisted in MongoDB Atlas
  - Verify you have the correct username and password

- **Node Module Issues**
  - Try deleting the `node_modules` folder and run `npm install` again
  - For client modules, delete `client/node_modules` and run `npm run client-install`

- **Port Conflicts**
  - If port 5000 is in use, change the PORT value in your `.env` file
  - If port 3000 is in use, React will automatically suggest using another port

## Need Help?

If you encounter any issues during setup or while using the application, please check the console logs for error messages. Most errors will be displayed there.