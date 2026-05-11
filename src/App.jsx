import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import VideoDetails from "./pages/VideoDetails";
import Watch from "./pages/Watch";
import AdminDashboard from "./pages/AdminDashboard";
import AddVideo from "./pages/AddVideo";
import ManageVideos from "./pages/ManageVideos";
import EditVideo from "./pages/EditVideo";
import ProfileSelection from "./pages/ProfileSelection";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= PROFILE SELECTION ================= */}

        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <ProfileSelection />
            </ProtectedRoute>
          }
        />

        {/* ================= PROTECTED ================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-video"
          element={
            <AdminRoute>
              <AddVideo />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/videos"
          element={
            <AdminRoute>
              <ManageVideos />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-video/:id"
          element={
            <AdminRoute>
              <EditVideo />
            </AdminRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 