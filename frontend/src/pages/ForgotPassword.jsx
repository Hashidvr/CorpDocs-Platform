import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/E-removebg-preview (2).png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/auth/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Reset link sent. Check your email.");
      } else {
        toast.error(data?.detail || "Error");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div
          className="text-blue-700 font-bold text-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </div>
      </nav>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center mt-[-60px]">
          <img src={logo} alt="CorpDocs" className="h-6 mx-auto mb-8" />

          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            Reset Your Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm mb-1 text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Go back to login
            </span>
          </p>

          <ToastContainer />
        </div>
      </div>
    </>
  );
}
