import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/E-removebg-preview (2).png";

export default function Mentions() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email || !token) {
      navigate("/login");
      return;
    }
    fetchShared();
  }, []);

  const fetchShared = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/documents/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const allDocs = await res.json();
      
      // Safely get user email
      const user = JSON.parse(localStorage.getItem("user") || {});
      const userEmail = user.email?.trim().toLowerCase();
      
      if (!userEmail) {
        throw new Error("No user email found");
      }

      // Improved filtering
      const sharedDocs = allDocs.filter(doc => {
        try {
          // Handle both array of objects and array of emails
          if (Array.isArray(doc.shared_with)) {
            return doc.shared_with.some(recipient => {
              if (typeof recipient === "string") {
                return recipient.toLowerCase() === userEmail;
              }
              if (recipient?.email) {
                return recipient.email.toLowerCase() === userEmail;
              }
              return false;
            });
          }
          return false;
        } catch (err) {
          console.error("Error filtering document:", doc.id, err);
          return false;
        }
      });

      setDocs(sharedDocs);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load mentions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="CorpDocs Logo"
            className="h-[34px] cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          Documents Mentioned to Me
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : docs.length === 0 ? (
          <p className="text-gray-600">No documents mention you.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Last Updated: {new Date(doc.last_updated).toLocaleString()}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    className="text-sm text-green-600 underline"
                    onClick={() => navigate(`/docs/${doc.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="text-sm text-yellow-600 underline"
                    onClick={() =>
                      navigate("/editor", { state: { docToEdit: doc } })
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}