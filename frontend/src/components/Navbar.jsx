import { useNavigate } from "react-router-dom";
import logo from "../assets/E-removebg-preview (2).png";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-6 flex items-center justify-between">
      {/* ✅ Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="CorpDocs Logo" className="h-[34px]" />
      </div>

      {/* ✅ Right-side Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Home
        </button>

        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
