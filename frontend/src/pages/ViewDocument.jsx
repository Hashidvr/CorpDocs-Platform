import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/E-removebg-preview (2).png";
import "react-quill/dist/quill.snow.css"; // Required for proper styling
import "react-toastify/dist/ReactToastify.css";
import "../styles/document-viewer.css"; // Custom styles for document viewing

function ViewDocument() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/documents/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch document");

      const data = await res.json();
      setDoc(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load document.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEdit = () => {
    navigate("/editor", { state: { docToEdit: doc } });
  };

  if (loading) return <p className="p-4 text-gray-600">Loading document...</p>;
  if (!doc) return <p className="p-4 text-red-600">Document not found.</p>;

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? "fixed inset-0 z-50 bg-white overflow-auto" : ""}`}>
      {/* Navbar - Hidden in fullscreen mode */}
      {!isFullscreen && (
        <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
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
              onClick={() => navigate("/docs")}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Back to Documents
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className={`mx-auto ${isFullscreen ? "p-6" : "max-w-6xl mt-12 px-6"} flex flex-col lg:flex-row gap-6 items-start`}>
        {/* Document Content */}
        <div className={`bg-white rounded-xl shadow-md w-full ${isFullscreen ? "border-none" : "p-6"}`}>
          {!isFullscreen && (
            <>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">{doc.title}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Last updated: {new Date(doc.last_updated).toLocaleString()}
              </p>
            </>
          )}

          {/* Document Controls */}
          <div className={`flex gap-3 mb-4 ${isFullscreen ? "p-4 bg-gray-50 sticky top-0 z-10" : "hidden"}`}>
            <button
              onClick={toggleFullscreen}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
            >
              Exit Fullscreen
            </button>
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Edit Document
            </button>
          </div>

          {/* Rich HTML content rendering - Core Fix */}
          <div className="ql-snow">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />
          </div>

          {/* Footer */}
          {!isFullscreen && (
            <div className="mt-6 flex justify-between items-center">
              <span
                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                  doc.is_public
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.is_public ? "🌐 Public Document" : "🔒 Private Document"}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Fullscreen
                </button>
                <button
                  onClick={handleEdit}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Version History Sidebar - Hidden in fullscreen mode */}
        {!isFullscreen && (
          <div className="w-full lg:w-1/4">
            <div className="sticky top-28 bg-white border border-gray-200 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Version History
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                View all saved versions of this document, compare and restore if
                needed.
              </p>
              <button
                onClick={() => navigate(`/docs/${id}/versions`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Version History →
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default ViewDocument;