import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect non-admins
  useEffect(() => {
    console.log("User object:", user);
    console.log("User role:user.role !", user?.role);
    if (!user) return;
  if (user.role !== "admin") {  
    navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch tickets
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
    if (user && user.role === "admin") {
      fetchTickets();
    }
  }, [user]);

  // Update ticket status
  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(
        `https://minimern-backend.onrender.com/api/ticket/${id}`,
        { status },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );

      // Update state immediately
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === id ? { ...ticket, status } : ticket
        )
      );
    } catch (error) {
      alert("Failed to update ticket status: " + (error.response?.data?.message || "Unknown error"));
    }
    setLoading(false);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  //if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
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
            
            {/* Status Dropdown */}
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Status:
              <select
                value={ticket.status}
                onChange={(e) => updateStatus(ticket._id, e.target.value)}
                className="ml-2 border border-gray-300 rounded-md p-1"
                disabled={loading}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </label>

            {/* Loading Indicator */}
            {loading && <p className="text-sm text-blue-500">Updating...</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
