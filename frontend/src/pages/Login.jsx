import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/E-removebg-preview (2).png";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: form.email,
            username: data.username, // <- make sure your backend sends this!
          })
        );

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 1500,
          onClose: () => navigate("/dashboard"),
        });
      } else {
        toast.error(data?.detail || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
            Login to CorpDocs
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

              <div className="text-right mt-1">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>

          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Login;
