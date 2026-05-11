import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSelection.css";

const profiles = [
  {
    id: 1,
    name: "Ichchhit",
    type: "blue",
  },
  {
    id: 2,
    name: "Guest",
    type: "green",
  },
  {
    id: 3,
    name: "Kids",
    type: "kids",
  },
  {
    id: 4,
    name: "Add Profile",
    type: "add",
  },
];

function ProfileSelection() {
  const navigate = useNavigate();

  const [loadingProfile, setLoadingProfile] = useState(null);

  const selectProfile = (profile) => {
    localStorage.setItem("netflixProfile", JSON.stringify(profile));

    setLoadingProfile(profile);

    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  if (loadingProfile) {
    return (
      <div className="profile-loading-page">
        <div className="netflix-loader">
          <div className="loader-ring"></div>

          <div className={`loading-avatar ${loadingProfile.type}`}>
            {loadingProfile.type === "blue" && (
              <div className="loading-face">
                <span></span>
                <span></span>
                <div></div>
              </div>
            )}

            {loadingProfile.type === "green" && (
              <div className="loading-face">
                <span></span>
                <span></span>
                <div></div>
              </div>
            )}

            {loadingProfile.type === "kids" && <h2>kids</h2>}

            {loadingProfile.type === "add" && <div className="loading-plus">+</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Who's watching?</h1>

      <div className="profiles-grid">
        {profiles.map((profile) => (
          <div
            className="profile-card"
            key={profile.id}
            onClick={() => selectProfile(profile)}
          >
            <div className={`profile-avatar-box ${profile.type}`}>
              {profile.type === "blue" && (
                <div className="face">
                  <span></span>
                  <span></span>
                  <div></div>
                </div>
              )}

              {profile.type === "green" && (
                <div className="face">
                  <span></span>
                  <span></span>
                  <div></div>
                </div>
              )}

              {profile.type === "kids" && <h2>kids</h2>}

              {profile.type === "add" && <div className="plus">+</div>}
            </div>

            <p>{profile.name}</p>
          </div>
        ))}
      </div>

      <button className="manage-btn">Manage Profiles</button>
    </div>
  );
}

export default ProfileSelection; 