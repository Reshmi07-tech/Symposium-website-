import Admin from "./Admin";
import Register from "./Register";
import Payment from "./Payment";
import EventPass from "./EventPass";
import QRPass from "./QRPass";

import departmentLogo from "./department-logo.jpeg";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// Members photos
import ragul from "./members/ragul.jpg";
import karthikeyan from "./members/karthikeyan.jpg";
import madhumitha from "./members/madhumitha.jpg";
import sasi from "./members/sasi.jpg";
import bharathKumar from "./members/bharath-kumar.jpg";
import reshmi from "./members/reshmi.jpg";
import rubesh from "./members/rubesh.jpg";
import elango from "./members/elango.jpg";
import robin from "./members/robin.jpg";
import kayalvizhi from "./members/kayalvizhi.jpg";
import charantej from "./members/charan-tej.jpg";
import kalaiselvi from "./members/kalaiselvi.jpg";
import ialiayaraja from "./members/ilaiyaraja.jpg";
import jayanth from "./members/jayanth.jpg";

function Home({ registrationClosed }) {
  const associationMembers = [
    {
      name: "RAGUL",
      posting: "President",
      image: ragul ,
    },
    {
      name: "KARTHIKEYAN",
      posting: "Treasurer",
      image: karthikeyan,
    },
    {
      name: "JAYANTH",
      posting: "Media Head",
      image: jayanth,
    },
    
    {
      name: "CHARAN TEJ",
      posting: "Vice President – I",
      image: charantej,
    },
    {
      name: "BHARATH KUMAR",
      posting: "Vice President – II",
      image: bharathKumar,
    },
    {
      name: "MADHUMITHA",
      posting: "Secretary",
      image: madhumitha,
    },
    {
      name: "RESHMI",
      posting: "Joint Secretary",
      image: reshmi,
    },
    
    {
      name: "RUBESH",
      posting: "Joint Treasurer",
      image: rubesh,
    },
    {
      name: "ROBIN",
      posting: "Media",
      image: robin,
    },
    {
      name: "ELANGO",
      posting: "EDITOR",
      image: elango,
    },
    
    {
      name: "SASI",
      posting: "Director",
      image: sasi,
    },
    
    {
      name: "ILAIYARAJA",
      posting: "Camara Man",
      image: ialiayaraja,
    },
    {
      name: "KALAISELVI",
      posting: "Office Bearer",
      image: kalaiselvi ,
    },
    {
      name: "KAYALVIZHI",
      posting: "Office Bearer",
      image: kayalvizhi ,
    },
  ];

  return (
    <div className="future-home">
      {/* Background layers */}
      <div className="campus-overlay"></div>
      <div className="grid-layer"></div>
      <div className="particles"></div>

      {/* Top Navigation */}
      <nav className="future-nav">
        <div className="nav-brand">
          <span className="nav-dot"></span>
          ECE DEPARTMENT
        </div>

        <div className="nav-links">
          <span>ECLECTIC'26</span>

          <span
            onClick={() => {
              document
                .getElementById("event-details")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ cursor: "pointer" }}
          >
            EVENTS
          </span>

          <button
  disabled={registrationClosed}
  onClick={() => {
    if (registrationClosed) return;
    window.location.href = "/register";
  }}
>
  {registrationClosed ? "SLOTS FILLED" : "REGISTER"}
</button>
        </div>
      </nav>

      {/* Main Hero */}
      <main className="future-hero">
        <div className="college-heading">
          <span>T.J.S.</span>
          <strong>ENGINEERING COLLEGE</strong>
        </div>

        <p className="hero-department">
          DEPARTMENT OF ELECTRONICS & COMMUNICATION ENGINEERING
        </p>

        {/* Department Logo */}
        <div className="logo-stage">
          <div className="logo-ring ring-one"></div>
          <div className="logo-ring ring-two"></div>
          <div className="logo-glow"></div>

          <img
            src={departmentLogo}
            alt="ECE Department Logo"
            className="hero-logo"
          />
        </div>

        {/* Event Title */}
        <div className="event-title">
          <p>ECE DEPARTMENT PRESENTS</p>

          <h1>
            ECLECTIC<span>'26</span>
          </h1>

          <div className="title-line">
            <i></i>
            <span>A NATIONAL LEVEL TECHNICAL SYMPOSIUM</span>
            <i></i>
          </div>
        </div>

        {/* Event Information */}
        <div className="hero-info">
          <div className="info-card">
            <small>DATE</small>
            <strong>22 OCTOBER</strong>
            <span>2026</span>
          </div>

          <div className="info-card">
            <small>VENUE</small>
            <strong>AUDITORIUM</strong>
            <span>T.J.S. CAMPUS</span>
          </div>
        </div>

        {/* Register Button */}
{registrationClosed ? (
  <div className="registration-closed">
    <h2>REGISTRATION SLOTS ARE FILLED</h2>
    <p> Online Registration is now closed.</p>
  </div>
) : (
  <button
    className="future-register"
    onClick={() => {
      window.location.href = "/register";
    }}
  >
    <span>REGISTER NOW</span>
    <b>↗</b>
  </button>
)}
      </main>
      <section className="about-section">
  <h2 className="about-title">ABOUT ECLECTIC’26</h2>

  <p>
    ECLECTIC’26 is an exciting technical symposium organized by the 
    Department of Electronics and Communication Engineering, T.J.S. Engineering College.

  </p>

  <p>
    The symposium is a platform for students to learn, compete, connect, create, 
    and showcase their talents beyond the classroom. It brings together innovation, 
    knowledge, creativity, teamwork, and entertainment in one energetic celebration.

  </p>
  <p>
   From challenging technical activities to engaging non-technical experiences,
    ECLECTIC’26 encourages students to think differently, discover their potential,
     and create memorable moments with fellow participants. 
  </p>

  <div className="event-types">
    <span>⚡ Technical Events</span>
    <span>🎯 Non-Technical Events</span>
    <span> 📅 22 October 2026</span>
    <span>Come. Compete. Create. Celebrate ECLECTIC’26.</span>
  </div>
</section>

      {/* ASSOCIATION MEMBERS */}
      <section className="association-section">
        <div className="section-heading">
        

          <h2>ASSOCIATION MEMBERS</h2>

          <p>THE TEAM BEHIND ECLECTIC'26</p>
        </div>

        <div className="association-grid">
          {associationMembers.map((member) => (
            <div className="member-card" key={member.posting}>
              {/* Member Photo */}
              <div className="member-photo-wrapper">
                <div className="rotating-ring"></div>

                <div className="member-photo">
                  {member.image ? (
                    <img src={member.image} alt={member.name} />
                  ) : (
                    <div className="member-placeholder">
                      <span>ECE</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Information */}
              <div className="member-info">
                <span>{member.posting}</span>

                <h3>{member.name}</h3>
              </div>
            </div>
          ))}
        </div>
      

      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-glow"></div>

        <div className="footer-content">
          {/* Footer Brand */}
          <div className="footer-brand">
            <span>ECLECTIC'26</span>

            <h3>DEPARTMENT OF ECE</h3>

            <p>T.J.S. ENGINEERING COLLEGE</p>
          </div>

          {/* Contact Details */}
          <div className="footer-contact">
            <h4>CONTACT</h4>

            <a href="mailto:eclectic26@gmail.com">
              ✉ eclectic.tjs@gmail.com
            </a>

            <a href="tel:+919176269657">
              ☎ +91 9176269657
            </a>

            <a href="tel:+919361757082">
              ☎ +91 9361757082
            </a>

            <a
              href="https://www.instagram.com/eclectic.26/"
              target="_blank"
              rel="noreferrer"
            >
              ◎ @eclectic.26
            </a>
          </div>
        </div>

              {/* Footer Divider */}
      <div className="footer-line"></div>

      {/* Developer Credit */}
      <div className="footer-developer">
        <p className="footer-college">
          ECLECTIC'26 — T.J.S. Engineering College
        </p>

        <p className="footer-credit">
          Designed &amp; Developed by
        </p>

        <h4>RESHMI MOORTHY</h4>

        <p className="footer-role">
          ECE Engineering Student | Aspiring Full Stack Developer
        </p>

        <p className="footer-copyright">
          © 2026 ECLECTIC'26. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
  );
}

/* =========================================
   APP ROUTING
========================================= */


function App() {
  const [approvedCount, setApprovedCount] = useState(0);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [approvalError, setApprovalError] = useState(false);

  const path = window.location.pathname;

  useEffect(() => {
    const approvedQuery = query(
      collection(db, "registrations"),
      where("approvalStatus", "==", "Approved")
    );

    const unsubscribe = onSnapshot(
      approvedQuery,
      (snapshot) => {
        setApprovedCount(snapshot.size);
        setLoadingApprovals(false);
        setApprovalError(false);
      },
      (error) => {
        console.error("Approved registrations error:", error);
        setApprovalError(true);
        setLoadingApprovals(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const registrationClosed = approvedCount >= 100;

  // Registration page protection
  if (path === "/register") {
    if (loadingApprovals) {
      return <p>Checking registration availability...</p>;
    }

    if (approvalError) {
      return (
        <div className="registration-closed">
          <h2>UNABLE TO CHECK REGISTRATION</h2>
          <p>Please try again later.</p>
          <button onClick={() => {
            window.location.href = "/";
          }}>
            GO TO HOME
          </button>
        </div>
      );
    }

    if (registrationClosed) {
      return <Home registrationClosed={true} />;
    }

    return <Register />;
  }

  if (path === "/payment") {
    return <Payment />;
  }

  if (path === "/event-pass") {
    return <EventPass />;
  }

  if (path === "/qr-pass") {
    return <QRPass />;
  }

  if (path === "/admin") {
    return <Admin />;
  }

  return (
    <Home
      registrationClosed={
        !loadingApprovals && !approvalError && registrationClosed
      }
    />
  );
}

export default App;
