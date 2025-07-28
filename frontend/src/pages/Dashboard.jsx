import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import docImg from "../assets/edit.png";
import viewImg from "../assets/file-solid.svg";
import mentionImg from "../assets/mention.png";
import logo from "../assets/E-removebg-preview (2).png";



function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

useEffect(() => {
  const userData = localStorage.getItem("user");
  if (!userData) {
    navigate("/login");
  } else {
    try {
      const parsedUser = JSON.parse(userData);
      setName(parsedUser.username || "User");
    } catch (err) {
      console.error("Invalid user data in localStorage");
      setName("User");
    }
  }
}, []);


  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const features = [
    {
      title: "Create / Edit Docs",
      img: docImg,
      desc: "Start a new document or update an existing one.",
      onClick: () => navigate("/editor"),
    },
    {
      title: "Browse Docs",
      img: viewImg,
      desc: "View all your saved and shared documents. Use smart search to find documents by title or content.",
      onClick: () => navigate("/docs"),
    },

    {
      title: "Mentions",
      img: mentionImg,
      desc: "View documents where you are mentioned.",
      onClick: () => navigate("/mentions"),
    },

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <nav className="bg-white shadow-md px-6 py-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img src={logo} alt="CorpDocs Logo" className="h-[34px]" />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Feature Grid */}
      <div className="px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Welcome, {name || "User"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={feature.onClick}
              className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition"
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="h-28 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold text-blue-700">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
