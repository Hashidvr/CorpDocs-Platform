import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Changed to token for JWT

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 text-center px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Your Team's Knowledge Hub
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Collaborate, document, and share knowledge seamlessly with CorpDocs - 
          the Confluence alternative built for modern teams.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(isLoggedIn ? "/editor" : "/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            {isLoggedIn ? "Create Document" : "Get Started Free"}
          </button>
          <button
            onClick={() => navigate(isLoggedIn ? "/docs" : "/login")}
            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-sm transition"
          >
            {isLoggedIn ? "Browse Docs" : "Sign In"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;