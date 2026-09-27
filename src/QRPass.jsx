function QRPass() {
  const params = new URLSearchParams(window.location.search);

  const savedData = sessionStorage.getItem("registrationData");

  const registrationData = savedData
    ? JSON.parse(savedData)
    : {};

  const fullName = registrationData.fullName || "N/A";
  const email = registrationData.email || "N/A";
  const phone = registrationData.phone || "N/A";
  const department = registrationData.department || "N/A";
  const collegeName = registrationData.collegeName || "N/A";

  const technicalEvent =
    registrationData.technicalEvent || "N/A";

  const nonTechnicalEvent =
    registrationData.nonTechnicalEvent || "N/A";

  const registrationId =
    params.get("registrationId") || "N/A";

  const registrationFee =
    registrationData.registrationFee || 50;

  const transactionId =
    registrationData.transactionId || "N/A";

  const paymentStatus =
    registrationData.paymentStatus || "Payment Submitted";

  return (
    <div className="qr-pass-page">
      <div className="qr-pass-card">

        <div className="qr-pass-header">
          <p>T.J.S. ENGINEERING COLLEGE</p>

          <span>
            ECE DEPARTMENT PRESENTS
          </span>

          <h1>
            ECLECTIC<span>'26</span>
          </h1>

          <h2>
            DIGITAL EVENT PASS
          </h2>
        </div>

        <div className="qr-pass-id">
          <small>
            REGISTRATION ID
          </small>

          <strong>
            {registrationId}
          </strong>
        </div>

        <div className="qr-pass-line"></div>

        <div className="qr-pass-details">

          <div className="qr-detail">
            <small>NAME</small>
            <p>{fullName}</p>
          </div>

          <div className="qr-detail">
            <small>EMAIL</small>
            <p>{email}</p>
          </div>

          <div className="qr-detail">
            <small>PHONE</small>
            <p>{phone}</p>
          </div>

          <div className="qr-detail">
            <small>COLLEGE</small>
            <p>{collegeName}</p>
          </div>

          <div className="qr-detail">
            <small>DEPARTMENT</small>
            <p>{department}</p>
          </div>

          <div className="qr-detail">
            <small>TECHNICAL EVENT</small>
            <p>{technicalEvent}</p>
          </div>

          <div className="qr-detail">
            <small>NON-TECHNICAL EVENT</small>
            <p>{nonTechnicalEvent}</p>
          </div>

        </div>

        <div className="qr-pass-event">

          <div>
            <small>DATE</small>
            <p>22 OCTOBER 2026</p>
          </div>

          <div>
            <small>VENUE</small>
            <p>AUDITORIUM</p>
          </div>

        </div>

        <div className="qr-pass-payment">

          <h3>
            PAYMENT DETAILS
          </h3>

          <div>
            <small>REGISTRATION FEE</small>
            <p>₹{registrationFee}</p>
          </div>

          <div>
            <small>TRANSACTION ID</small>
            <p>{transactionId}</p>
          </div>

          <div>
            <small>PAYMENT STATUS</small>
            <p className="payment-status">
              {paymentStatus}
            </p>
          </div>

        </div>

        <div className="qr-pass-footer">

          <p>
            ECLECTIC'26
          </p>

          <span>
            ECE DEPARTMENT • T.J.S. ENGINEERING COLLEGE
          </span>

        </div>

      </div>
    </div>
  );
}

export default QRPass;