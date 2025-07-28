import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Docs from "./pages/Docs";
import Mentions from "./pages/Mentions";
import ViewDocument from "./pages/ViewDocument";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ViewPublicDocument from "./pages/ViewPublicDocument";
import PublicEditor from "./pages/PublicEditor";
import VersionHistory from "./pages/VersionHistory";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/mentions" element={<Mentions />} />
        <Route path="/docs/:id" element={<ViewDocument />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        <Route path="/public-docs/:id" element={<ViewPublicDocument />} />
        <Route path="/public-editor/:id" element={<PublicEditor />} />
        <Route path="/docs/:id/versions" element={<VersionHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
