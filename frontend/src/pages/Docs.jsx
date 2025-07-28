import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/E-removebg-preview (2).png";

function Docs() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/documents/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      } else {
        toast.error("Failed to load documents");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this document?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/documents/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Document deleted!");
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        toast.error("Failed to delete document.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="CorpDocs Logo" className="h-[34px]" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Back
          </button>
        </div>
      </nav>

      {/* Documents */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          Browse Documents
        </h2>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or content..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Document List */}
        {filteredDocuments.length === 0 ? (
          <p className="text-gray-600">No matching documents found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition relative"
              >
                {/* ✅ Public/Private Badge */}
                <span
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    doc.is_public
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doc.is_public ? "🌐 Public" : "🔒 Private"}
                </span>

                <h3
                  className="text-xl font-semibold text-blue-700"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(doc.title, searchTerm),
                  }}
                ></h3>

                <div
                  className="text-sm text-gray-700 prose max-w-none line-clamp-4"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(doc.content.slice(0, 300), searchTerm),
                  }}
                ></div>

                <p className="text-sm text-gray-500">
                  Created: {new Date(doc.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Last Updated: {new Date(doc.last_updated).toLocaleString()}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    className="text-sm text-green-600 underline"
                    onClick={() => navigate(doc.is_public ? `/public-docs/${doc.id}` : `/docs/${doc.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="text-sm text-blue-600 underline"
                    onClick={() =>
                      navigate("/editor", { state: { docToEdit: doc } })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-600 underline"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </button>
                  {doc.is_public && (
                    <button
                      className="text-sm text-purple-600 underline"
                      onClick={() => {
                        const link = `http://localhost:5173/public-docs/${doc.id}`;
                        navigator.clipboard.writeText(link);
                        toast.success("Public link copied!");
                      }}
                    >
                      Copy Link
                    </button>
                  )}
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

export default Docs;
