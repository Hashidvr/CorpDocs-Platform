import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/E-removebg-preview (2).png";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log("🔍 Registration error response:", data); // 👈 log the full backend error

      if (response.ok) {
        localStorage.setItem("token", data.token.access);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Registration successful!", {
          position: "top-center",
          autoClose: 1500,
          onClose: () => navigate("/dashboard"),
        });
      } else {
        const errorMessage =
          data?.detail ||
          Object.values(data).flat().join(", ") || // show field-level error
          "Registration failed.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
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
            Create your CorpDocs account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm mb-1 text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>

          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Register;
