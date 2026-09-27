import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import departmentLogo from "./department-logo.jpeg";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [technicalEvent, setTechnicalEvent] = useState("");
  const [nonTechnicalEvent, setNonTechnicalEvent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!technicalEvent || !nonTechnicalEvent) {
      setError(
        "Please select one Technical Event and one Non-Technical Event."
      );
      return;
    }

    const registrationData = {
      fullName,
      email,
      phone,
      department,
      collegeName,
      technicalEvent,
      nonTechnicalEvent,
    };
  const docRef = await addDoc(collection(db, "registrations"), {
  ...registrationData,
  registrationDate: new Date().toISOString(),
});
sessionStorage.setItem("registrationDocId", docRef.id);

    sessionStorage.setItem(
      "registrationData",
      JSON.stringify(registrationData)
    );

    setError("");
    window.location.href = "/payment";
  };

  return (
    <div className="register-page">
      <div className="register-box">

        {/* ECLECTIC title with logo */}
        <div className="register-title">
          <img
            src={departmentLogo}
            alt="ECE Department Logo"
            className="register-title-logo"
          />

          <h1>
            ECLECTIC<span>'26</span>
          </h1>
        </div>

        <p className="register-subtitle">
          REGISTRATION FORM
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>FULL NAME</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>PHONE NUMBER</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>DEPARTMENT</label>
            <input
              type="text"
              placeholder="Enter your department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>COLLEGE NAME</label>
            <input
              type="text"
              placeholder="Enter your college name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
            />
          </div>

          <div className="event-section">
            <h2>TECHNICAL EVENTS</h2>

            <p className="event-note">
              Select any ONE technical event
            </p>

            <div className="event-list">
              <label>
                <input
                  type="radio"
                  name="technicalEvent"
                  value="Paper Presentation"
                  checked={technicalEvent === "Paper Presentation"}
                  onChange={(e) => setTechnicalEvent(e.target.value)}
                />
                Paper Presentation
              </label>

              <label>
                <input
                  type="radio"
                  name="technicalEvent"
                  value="Project Expo"
                  checked={technicalEvent === "Project Expo"}
                  onChange={(e) => setTechnicalEvent(e.target.value)}
                />
                Project Expo
              </label>

              <label>
                <input
                  type="radio"
                  name="technicalEvent"
                  value="Coding Challenge"
                  checked={technicalEvent === "Coding Challenge"}
                  onChange={(e) => setTechnicalEvent(e.target.value)}
                />
                Coding Challenge
              </label>

              <label>
                <input
                  type="radio"
                  name="technicalEvent"
                  value="Circuit Debugging"
                  checked={technicalEvent === "Circuit Debugging"}
                  onChange={(e) => setTechnicalEvent(e.target.value)}
                />
                Circuit Debugging
              </label>

              <label>
                <input
                  type="radio"
                  name="technicalEvent"
                  value="Technical Quiz"
                  checked={technicalEvent === "Technical Quiz"}
                  onChange={(e) => setTechnicalEvent(e.target.value)}
                />
                Technical Quiz
              </label>
            </div>
          </div>

          <div className="event-section">
            <h2>NON-TECHNICAL EVENTS</h2>

            <p className="event-note">
              Select any ONE non-technical event
            </p>

            <div className="event-list">
              <label>
                <input
                  type="radio"
                  name="nonTechnicalEvent"
                  value="Connections"
                  checked={nonTechnicalEvent === "Connections"}
                  onChange={(e) => setNonTechnicalEvent(e.target.value)}
                />
                Connections
              </label>

              <label>
                <input
                  type="radio"
                  name="nonTechnicalEvent"
                  value="Treasure Hunt"
                  checked={nonTechnicalEvent === "Treasure Hunt"}
                  onChange={(e) => setNonTechnicalEvent(e.target.value)}
                />
                Treasure Hunt
              </label>

              <label>
                <input
                  type="radio"
                  name="nonTechnicalEvent"
                  value="Dumb Charades"
                  checked={nonTechnicalEvent === "Dumb Charades"}
                  onChange={(e) => setNonTechnicalEvent(e.target.value)}
                />
                Dumb Charades
              </label>

              <label>
                <input
                  type="radio"
                  name="nonTechnicalEvent"
                  value="Photography"
                  checked={nonTechnicalEvent === "Photography"}
                  onChange={(e) => setNonTechnicalEvent(e.target.value)}
                />
                Photography
              </label>

              <label>
                <input
                  type="radio"
                  name="nonTechnicalEvent"
                  value="Meme Creation"
                  checked={nonTechnicalEvent === "Meme Creation"}
                  onChange={(e) => setNonTechnicalEvent(e.target.value)}
                />
                Meme Creation
              </label>
            </div>
          </div>

          {error && (
            <p className="event-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="submit-btn"
          >
            CONTINUE
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;