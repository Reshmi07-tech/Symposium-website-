import { QRCodeCanvas } from "qrcode.react";
import departmentLogo from "./department-logo.jpeg";

function EventPass() {
  const savedData = sessionStorage.getItem("registrationData");

  const registrationData = savedData ? JSON.parse(savedData) : {};

  const fullName = registrationData.fullName || "PARTICIPANT";
  const department = registrationData.department || "ECE";
  const collegeName =
    registrationData.collegeName || "T.J.S. ENGINEERING COLLEGE";

  const technicalEvent =
    registrationData.technicalEvent || "Not Selected";

  const nonTechnicalEvent =
    registrationData.nonTechnicalEvent || "Not Selected";

  const specialEvent =
    registrationData.specialEvent || "Not Selected";

  const transactionId =
    registrationData.transactionId || "Not Submitted";

  const registrationId =
    registrationData.registrationId || "EC26-000000";

  const qrData =
    "https://eclectic26.vercel.app/qr-pass?registrationId=" +
    encodeURIComponent(registrationId);

  return (
    <div className="event-pass-page">

      {/* Background glow */}
      <div className="ticket-glow ticket-glow-one"></div>
      <div className="ticket-glow ticket-glow-two"></div>

      <div className="event-pass">

        {/* ================= MAIN TICKET ================= */}
        <div className="pass-main">

          <div className="ticket-top">

            <div className="college-brand">
              <img
                src={departmentLogo}
                alt="ECE Department Logo"
                className="pass-logo"
              />

              <div>
                <p>T.J.S. ENGINEERING COLLEGE</p>
                <span>DEPARTMENT OF ECE</span>
              </div>
            </div>

            <div className="ticket-type">
              EVENT
              <br />
              PASS
            </div>

          </div>

          {/* Main ECLECTIC title */}
          <div className="pass-event-title">

            <div className="title-line"></div>

            <h1>
              ECLECTIC<span>'26</span>
            </h1>

            <p>ECE DEPARTMENT SYMPOSIUM</p>

            <div className="title-line"></div>

          </div>

          <div className="event-highlight">
            <span>ANNUAL TECHNICAL SYMPOSIUM</span>
            <strong>ECLECTIC'26</strong>
          </div>

          {/* Participant details */}
          <div className="pass-details">

            <div className="detail-box name-box">
              <small>PARTICIPANT NAME</small>
              <p>{fullName}</p>
            </div>

            <div className="detail-box">
              <small>COLLEGE</small>
              <p>{collegeName}</p>
            </div>

            <div className="detail-box">
              <small>DEPARTMENT</small>
              <p>{department}</p>
            </div>

            <div className="detail-box event-box">
              <small>TECHNICAL EVENT</small>
              <p>{technicalEvent}</p>
            </div>

            <div className="detail-box event-box">
              <small>NON-TECHNICAL EVENT</small>
              <p>{nonTechnicalEvent}</p>
            </div>

            <div className="detail-box event-box">
              <small>SPECIAL EVENT</small>
              <p>{specialEvent}</p>
            </div>

          </div>

          {/* Bottom information */}
          <div className="pass-bottom">

            <div>
              <small>DATE</small>
              <p>22 OCTOBER 2026</p>
            </div>

            <div>
              <small>VENUE</small>
              <p>AUDITORIUM • T.J.S. CAMPUS</p>
            </div>

            <div className="amount-box">
              <small>ENTRY FEE</small>
              <p>₹99</p>
            </div>

          </div>

        </div>

        {/* ================= TICKET STUB ================= */}
        <div className="pass-side">

          <div className="side-content">

            <p className="side-small-title">
              ECLECTIC
            </p>

            <h2>
              '2K26'
            </h2>

            <div className="side-divider"></div>

            <p className="side-pass-text">
              EVENT
              <br />
              PASS
            </p>

            <div className="pass-qr">
              <QRCodeCanvas
                value={qrData}
                size={105}
                bgColor="#ffffff"
                fgColor="#111111"
                level="H"
              />
            </div>

            <p className="scan-text">
              SCAN TO VERIFY
            </p>

            <div className="side-info">
              <small>REG ID</small>
              <strong>{registrationId}</strong>
            </div>

            <div className="side-info">
              <small>AMOUNT</small>
              <strong>₹99</strong>
            </div>

          </div>

          <div className="stub-bottom">
            ECLECTIC'26 • 22 OCT 2026
          </div>

        </div>

      </div>

      {/* Transaction information */}
      <div className="ticket-transaction">
        <span>TRANSACTION ID</span>
        <strong>{transactionId}</strong>
      </div>

    </div>
  );
}

export default EventPass;