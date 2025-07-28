import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";

function PublicEditor() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimer = useRef(null);

  // Fetch document data on load
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/documents/public-documents/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch document");
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error(err);
        toast.error("Could not load document.");
      }
    };

    fetchDoc();
  }, [id]);

  const autoSave = async () => {
    if (!title || !content) return;

    const mentionMatches = content.match(/@[\w.-]+@[\w.-]+\.\w+/g) || [];
    const mentions = mentionMatches.map((m) => m.replace(/^@/, ""));

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/documents/public-documents/${id}/edit/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mentions }),
      });

      if (res.ok) {
        console.log("✅ Auto-saved public doc");
      } else {
        const error = await res.json();
        console.error("Auto-save failed:", error);
      }
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  };

  useEffect(() => {
    if (!title && !content) return;
    if (isSaving) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      autoSave();
    }, 5000);
  }, [title, content, isSaving]);

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    const mentionMatches = content.match(/@[\w.-]+@[\w.-]+\.\w+/g) || [];
    const mentions = mentionMatches.map((m) => m.replace(/^@/, ""));

    try {
      setIsSaving(true);
      const res = await fetch(`http://127.0.0.1:8000/api/documents/public-documents/${id}/edit/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mentions }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(" Public document updated!", { autoClose: 1500 });
      } else {
        toast.error(data?.detail || "Failed to save.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Public Document</h2>

        <input
          type="text"
          placeholder="Document Title"
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <ReactQuill theme="snow" value={content} onChange={setContent} className="mb-6" />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Document
        </button>

        <ToastContainer />
      </div>
    </div>
  );
}

export default PublicEditor;
