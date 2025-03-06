import { useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate(); 

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard"); 
    }
  }, [user, navigate]);

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
    if (user && user.role === "admin") {fetchTickets(); navigate("/admin"); } 
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `https://minimern-backend.onrender.com/api/ticket/${id}`,
        { status },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setTickets(tickets.map((ticket) =>
        ticket._id === id ? response.data : ticket 
      ));
    } catch (error) {
      alert("Failed to update ticket status: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  if (!user || user.role !== "admin") return null; 

  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tickets</h2>
      
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
            <p className="text-gray-600 mt-1">{ticket.description}</p>
            <p className="text-sm text-gray-500 mt-2">Status: <span className="font-medium">{ticket.status}</span></p>
            
            <div className="mt-3 space-x-2">
              <button
                onClick={() => updateStatus(ticket._id, "Open")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
              >
                Open
              </button>
              <button
                onClick={() => updateStatus(ticket._id, "In Progress")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition"
              >
                In Progress
              </button>
              <button
                onClick={() => updateStatus(ticket._id, "Closed")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
              >
                Closed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;