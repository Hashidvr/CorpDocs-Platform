import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewPublicDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/documents/public-documents/${id}/`);
        if (!res.ok) {
          throw new Error("Document not found or not public");
        }
        const data = await res.json();
        setDoc(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load public document.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id]);

  const handleEdit = () => {
    if (!doc) return;
   navigate(`/public-editor/${doc.id}`);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!doc) {
    return <div className="p-4 text-center text-red-500">Document not found or not public.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{doc.title}</h1>
        <div
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Edit This Document
        </button>
      </div>
    </div>
  );
}

export default ViewPublicDocument;
