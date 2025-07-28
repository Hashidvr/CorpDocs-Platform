import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/E-removebg-preview (2).png";

function Editor() {
  const location = useLocation();
  const docToEdit = location.state?.docToEdit;
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [title, setTitle] = useState(docToEdit?.title || "");
  const [content, setContent] = useState(docToEdit?.content || "");
  const [docId, setDocId] = useState(docToEdit?.id || null);
  const [isPublic, setIsPublic] = useState(docToEdit?.is_public || false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const token = localStorage.getItem("token");

  const debounceTimer = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Quill modules configuration - UNCHANGED
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "background"
  ];

  // Check authentication - UNCHANGED
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || !token) {
      navigate("/login");
    }
  }, [navigate, token]);

  // Calculate word count - UNCHANGED
  useEffect(() => {
    if (content) {
      const text = quillRef.current?.getEditor().getText() || "";
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    } else {
      setWordCount(0);
    }
  }, [content]);

  // NEW: Track changes for auto-save
  const handleContentChange = (value) => {
    setContent(value);
    setHasChanges(true);
    
    // Reset the timer on each change
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Start new timer
    debounceTimer.current = setTimeout(() => {
      if (hasChanges) {
        autoSave();
        setHasChanges(false);
      }
    }, 5000);
  };

  // Auto-save function - MODIFIED to work with change tracking
  const autoSave = useCallback(async () => {
    if ((!title && !content) || !hasChanges) return;

    setIsSaving(true);
    const mentionMatches = content.match(/@[\w.-]+@[\w.-]+\.\w+/g) || [];
    const mentions = mentionMatches.map((m) => m.replace(/^@/, ""));

    try {
      const url = docId 
        ? `http://127.0.0.1:8000/api/documents/${docId}/`
        : "http://127.0.0.1:8000/api/documents/";
      
      const method = docId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title, 
          content, 
          mentions, 
          is_public: isPublic 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!docId && data?.id) {
          setDocId(data.id);
        }
        toast.success("Auto-saved", { autoClose: 1000 });
      } else {
        throw new Error(data?.message || "Auto-save failed");
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [title, content, docId, isPublic, token, hasChanges]);

  // Clean up timer on unmount - NEW
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Handle manual save - UNCHANGED
  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Title and content are required!");
      return;
    }

    setIsSaving(true);
    const mentionMatches = content.match(/@[\w.-]+@[\w.-]+\.\w+/g) || [];
    const mentions = mentionMatches.map((m) => m.replace(/^@/, ""));

    const payload = { 
      title, 
      content, 
      mentions, 
      is_public: isPublic 
    };

    try {
      const response = await fetch(
        docId
          ? `http://127.0.0.1:8000/api/documents/${docId}/`
          : "http://127.0.0.1:8000/api/documents/",
        {
          method: docId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (!docId && data?.id) setDocId(data.id);
        toast.success("Document saved successfully!", {
          autoClose: 1500,
        });
      } else {
        console.error("Backend error response:", data);
        toast.error(
          data?.detail ||
            data?.non_field_errors?.[0] ||
            data?.title?.[0] ||
            data?.content?.[0] ||
            "Failed to save document."
        );
      }
    } catch (error) {
      console.error("Manual save error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle public toggle - UNCHANGED
  const handlePublicToggle = async (e) => {
    const newIsPublic = e.target.checked;
    setIsPublic(newIsPublic);

    if (docId) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/documents/${docId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_public: newIsPublic }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Visibility update failed:", errData);
          toast.error("Failed to update visibility");
          setIsPublic(!newIsPublic);
        } else {
          toast.success(`Document is now ${newIsPublic ? "public" : "private"}`);
        }
      } catch (err) {
        console.error("Toggle error:", err);
        toast.error("Failed to update visibility");
        setIsPublic(!newIsPublic);
      }
    }
  };

  // THE REST OF YOUR COMPONENT REMAINS EXACTLY THE SAME
  // Only change is replacing setContent with handleContentChange in the ReactQuill component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - UNCHANGED */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b border-gray-200 mb-8">
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
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Editor Block - UNCHANGED except for onChange handler */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          {docId ? "Edit Document" : "Create Document"}
        </h2>

        {/* Title Input - UNCHANGED */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Document Title"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasChanges(true);
            }}
          />
        </div>

        {/* Rich Text Editor - ONLY CHANGE IS onChange HANDLER */}
        <div className="mb-4">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}  // Changed from setContent to handleContentChange
            modules={modules}
            formats={formats}
            className="h-[400px] mb-2"
            placeholder="Start writing your document here..."
          />
          <div className="text-sm text-gray-500">
            Word count: {wordCount} | Auto-saves after 5s of inactivity {isSaving && "(Saving...)"}
          </div>
        </div>

        {/* Document Controls - UNCHANGED */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Public Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="public-toggle"
              checked={isPublic}
              onChange={handlePublicToggle}
              className="w-4 h-4"
            />
            <label htmlFor="public-toggle" className="text-sm text-gray-700">
              Make document public
            </label>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/docs")}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Document"}
            </button>
          </div>
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Editor;