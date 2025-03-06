import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const {  logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  // Fetch tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://minimern-backend.onrender.com/api/ticket", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  // Create a new ticket
  const createTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://minimern-backend.onrender.com/api/ticket",
        { title, description },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setTickets([...tickets, response.data]);
      setTitle(""); 
      setDescription("");
    } catch (error) {
      alert("Failed to create ticket");
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
        <button
          onClick={handleLogout }
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
         
        </button>
      </div>

      {/* Ticket Creation Form */}
      <form onSubmit={createTicket} className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Ticket</h2>
        <input
          type="text"
          placeholder="Ticket Title"
          className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Ticket Description"
          className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md transition"
        >
          Create Ticket
        </button>
      </form>

      {/* Tickets List */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Tickets</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
            <p className="text-gray-600 mt-1">{ticket.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: <span className="font-medium">{ticket.status}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;