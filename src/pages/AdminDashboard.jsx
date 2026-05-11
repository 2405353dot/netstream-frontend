 import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Admin Dashboard</h1>

      <p style={subText}>
        Welcome Admin. Manage your Netstream platform 🚀
      </p>

      <div style={statsContainer}>
        <div style={cardStyle}>
          <h3>Total Videos</h3>
          <p style={numberStyle}>--</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p style={numberStyle}>--</p>
        </div>

        <div style={cardStyle}>
          <h3>Watch Time</h3>
          <p style={numberStyle}>--</p>
        </div>
      </div>

      <div style={actionContainer}>
        <div style={cardStyle}>
          <h2>Add Video</h2>
          <p>Add new movies or shows</p>

          <button
            style={btnStyle}
            onClick={() => navigate("/admin/add-video")}
          >
            + Add New Video
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Manage Videos</h2>
          <p>Edit or delete videos</p>

          <button
            style={btnStyle}
            onClick={() => navigate("/admin/videos")}
          >
            View Videos
          </button>
        </div>

        <div style={cardStyle}>
          <h2>Users</h2>
          <p>Control user access</p>

          <button style={btnStyle}>
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "white",
  padding: "40px",
};

const headingStyle = {
  fontSize: "36px",
  marginBottom: "10px",
};

const subText = {
  color: "#aaa",
  marginBottom: "30px",
};

const statsContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "40px",
};

const actionContainer = {
  display: "flex",
  gap: "20px",
};

const cardStyle = {
  background: "#1a1a1a",
  padding: "25px",
  borderRadius: "12px",
  minWidth: "220px",
};

const btnStyle = {
  marginTop: "10px",
  padding: "10px 15px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
};

export default AdminDashboard;