
import { QRCodeCanvas } from "qrcode.react";
import departmentLogo from "./department-logo.jpeg";

function EventPass() {
  const savedData = sessionStorage.getItem("registrationData");

  const registrationData = savedData
    ? JSON.parse(savedData)
    : {};

  const fullName = registrationData.fullName || "";
  const department = registrationData.department || "";
  const collegeName = registrationData.collegeName || "";
  const technicalEvent = registrationData.technicalEvent || "";
  const nonTechnicalEvent = registrationData.nonTechnicalEvent || "";

  const registrationId =
    registrationData.registrationId || "EC26-000000";


  const qrData =
  "http://10.185.97.175:3000/qr-pass?registrationId=" +
  encodeURIComponent(registrationId);
  return (
    <div className="event-pass-page">

      <div className="event-pass">

        <div className="pass-main">

          <p className="pass-label">
            T.J.S. ENGINEERING COLLEGE
          </p>

          <p className="pass-department">
            ECE DEPARTMENT PRESENTS
          </p>

          {/* ECLECTIC title with logo */}
          <div className="pass-event-title">
            <img
              src={departmentLogo}
              alt="ECE Department Logo"
              className="pass-title-logo"
            />

            <h1>
              ECLECTIC<span>'26</span>
            </h1>
          </div>

          <p className="pass-title">
            EVENT PASS
          </p>

          <div className="pass-line"></div>

          <div className="pass-details">

            <div>
              <small>NAME</small>
              <p>{fullName}</p>
            </div>

            <div>
              <small>COLLEGE</small>
              <p>{collegeName}</p>
            </div>

            <div>
              <small>DEPARTMENT</small>
              <p>{department}</p>
            </div>

            <div>
              <small>TECHNICAL EVENT</small>
              <p>{technicalEvent}</p>
            </div>

            <div>
              <small>NON-TECHNICAL EVENT</small>
              <p>{nonTechnicalEvent}</p>
            </div>

          </div>

          <div className="pass-bottom">

            <div>
              <small>DATE</small>
              <p>22 OCTOBER 2026</p>
            </div>

            <div>
              <small>VENUE</small>
              <p>AUDITORIUM</p>
            </div>

          </div>

        </div>

        <div className="pass-side">

          <div className="side-line"></div>

          <p className="side-text">
            ECLECTIC'26
          </p>

          <div className="pass-qr">
            <QRCodeCanvas
              value={qrData}
              size={90}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>

          <small>REG ID</small>

          <p className="reg-id">
            {registrationId}
          </p>

        </div>

      </div>

    </div>
  );
}

export default EventPass;

