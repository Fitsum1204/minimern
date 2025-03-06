import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
     
    },
    
    status: {
      type: String,
      enum: ['Open', 'In Progress','Closed'],
      default: 'Open',
    },
   
  }, 
  { timestamps: true });
  const Ticket = mongoose.model("ticket", TicketSchema);
  export default Ticket;


 