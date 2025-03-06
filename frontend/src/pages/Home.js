import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-200 text-gray-800">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to TicketMaster</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Manage your tickets effortlessly. Log in to get started or sign up to join our community!
        </p>
      </header>

      {/* Buttons */}
      <div className="flex space-x-6">
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>
        <button
          onClick={handleSignup}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Sign Up
        </button>
      </div>

      {/* Optional Footer */}
      <footer className="mt-16 text-sm text-gray-600">
        <p>&copy; 2025 TicketMaster. </p>
      </footer>
    </div>
  );
};

export default Home;