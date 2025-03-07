import { BrowserRouter as Router,Routes ,Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

function App() {
  return (
   <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Admin />} />
        <Route path="/admin" element={<Dashboard/>} />
      </Routes>
   </Router>
  );
}

export default App;
