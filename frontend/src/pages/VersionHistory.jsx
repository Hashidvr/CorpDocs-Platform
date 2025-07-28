import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/E-removebg-preview (2).png";

export default function VersionHistory() {
  const { id } = useParams();
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/documents/${id}/versions/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch version history");

      const data = await res.json();
      setVersions(data);
    } catch (err) {
      console.error("Version fetch error:", err);
      toast.error("Failed to load version history");
    }
  };

  const handleRestore = async (versionId) => {
    const confirm = window.confirm("Are you sure you want to restore this version?");
    if (!confirm) return;

    const version = versions.find((v) => v.id === versionId);
    if (!version) return;

    try {
      const res = await fetch(`http://localhost:8000/api/documents/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: version.content,
        }),
      });

      if (res.ok) {
        toast.success("Version restored!");
        navigate(`/docs/${id}`);
      } else {
        toast.error("Failed to restore version.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="CorpDocs Logo" className="h-[34px]" />
        </div>
        <button
          onClick={() => navigate(`/docs/${id}`)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Back to Document
        </button>
      </nav>

      {/* Version List */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Version History</h1>

        {versions.length === 0 ? (
          <p className="text-gray-600">No versions found.</p>
        ) : (
          <div className="space-y-4">
            {versions.map((v) => (
              <div
                key={v.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Edited by:</strong>{" "}
                  <span className="text-blue-700">{v.edited_by}</span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(v.created_at).toLocaleString()}
                </p>

                {/* Preview of content */}
                <div
                  className="text-sm text-gray-800 line-clamp-3 max-h-24 overflow-hidden mb-3"
                  dangerouslySetInnerHTML={{ __html: v.content }}
                />

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedVersion(v)}
                    className="bg-gray-100 border px-3 py-1 rounded text-sm hover:bg-gray-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleRestore(v.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastContainer />
      </div>

      {/* Modal for full content view */}
      {selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Full Version Content</h2>
            <div
              className="prose max-w-none overflow-y-auto max-h-[400px]"
              dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
            />
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedVersion(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
