import Register from "./Register";
import Payment from "./Payment";
import EventPass from "./EventPass";
import QRPass from "./QRPass";
import departmentLogo from "./department-logo.jpeg";

function Home() {
  return (
    <div className="future-home">

      {/* Background layers */}
      <div className="campus-overlay"></div>
      <div className="grid-layer"></div>
      <div className="particles"></div>

      {/* Top navigation */}
      <nav className="future-nav">
        <div className="nav-brand">
          <span className="nav-dot"></span>
          ECE DEPARTMENT
        </div>

        <div className="nav-links">
          <span>ECLECTIC'26</span>
          <span>EVENTS</span>

          <button
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            REGISTER
          </button>
        </div>
      </nav>

      {/* Main hero */}
      <main className="future-hero">

        <div className="college-heading">
          <span>T.J.S.</span>
          <strong>ENGINEERING COLLEGE</strong>
        </div>

        <p className="hero-department">
          DEPARTMENT OF ELECTRONICS & COMMUNICATION ENGINEERING
        </p>

        {/* Logo */}
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

        {/* Event title */}
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

        {/* Event information */}
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

        {/* CTA */}
        <button
          className="future-register"
          onClick={() => {
            window.location.href = "/register";
          }}
        >
          <span>REGISTER NOW</span>
          <b>↗</b>
        </button>

      </main>

      {/* 3D chip */}
      <div className="chip-platform">

        <div className="chip-shadow"></div>

        <div className="chip">

          <div className="chip-core">
            <span>ECE</span>
            <small>ECLECTIC'26</small>
          </div>

          <div className="chip-pin pin-1"></div>
          <div className="chip-pin pin-2"></div>
          <div className="chip-pin pin-3"></div>
          <div className="chip-pin pin-4"></div>
          <div className="chip-pin pin-5"></div>
          <div className="chip-pin pin-6"></div>

        </div>

        <div className="circuit circuit-left"></div>
        <div className="circuit circuit-right"></div>

      </div>

    </div>
  );
}

function App() {
  const path = window.location.pathname;

  if (path === "/register") return <Register />;
  if (path === "/payment") return <Payment />;
  if (path === "/event-pass") return <EventPass />;
  if (path === "/qr-pass") return <QRPass />;

  return <Home />;
}

export default App;