import { Router } from "express";
import User from "../../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Ticket from "../../models/Ticket.js";
import { check, validationResult } from "express-validator";
import sanitize from 'sanitize-html';
import {verifyToken,adminOnly} from "../../middleware/verifyToken.js";

const ticket = Router();

// @route POST api/ticket   
// @desc Create a ticket
// @access private
ticket.post(
  "/",
 verifyToken, [
    check("title").notEmpty().withMessage("Title is required"),
    check("description").notEmpty().withMessage("Description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    try {
      // Sanitize inputs
      const ticketData = {
        title: sanitize(title.trim()),
        description: sanitize(description.trim()),
        user: req.user.id,
        createdAt: new Date(),
        status: "Open" // Explicitly set default status
      };

      let ticket = new Ticket(ticketData);
      await ticket.save();
      await ticket.populate('user', 'name email');
      res.status(201).json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/ticket
// @desc Get all tickets
// @access Admin and

ticket.get("/", verifyToken, async (req, res) => {
  try {
    const tickets = req.user.role ==='admin' 
    ?await Ticket.find().populate('user','name email').sort({ createdAt: -1 })
    :await Ticket.find({ user: req.user.id });
    
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/ticket/:id
// @desc update ticket status
// @access Admin
ticket.put('/:id',verifyToken,adminOnly,async(req,res)=>{
    const { status } = req.body;

    if (!["Open", "In Progress", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
  
    try {
      const ticket = await Ticket.findById(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      ticket.status = status;
      await ticket.save();
  
      res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route DELETE api/ticket/:id
// @desc Delete a ticket
// @access Admin
ticket.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.deleteOne();
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error('Ticket deletion error:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }
    res.status(500).json({ 
      message: "Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});
export default ticket;