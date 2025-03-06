import dotenv from 'dotenv';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'



import auth from './routes/api/authRoutes.js';
import user from './routes/api/user.js';
import ticket from './routes/api/ticket.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(express.json({extended: false}));
app.use(cors({
    origin: 'https://minimern-frontend.onrender.com' // Allow requests from frontend origin
  }));
app.get('/' ,cors(),(req,res) => res.send('API Running'));

// Routes
app.use('/api/user',cors(), user);
app.use('/api/auth',cors(), auth);
app.use('/api/ticket',cors(), ticket);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
