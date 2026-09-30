
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import paymentQR from "./payment-qr.png";
import departmentLogo from "./department-logo.jpeg";

function Payment() {
  const [transactionId, setTransactionId] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [error, setError] = useState("");

  const registrationFee = 99;

  const handleProceed = async (e) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      setError("Please enter your Transaction ID.");
      return;
    }

    if (!paymentProof) {
      setError("Please upload your payment screenshot.");
      return;
    }

    const registrationData =
      JSON.parse(sessionStorage.getItem("registrationData")) || {};

    const registrationId =
      "EC26-" + Math.floor(100000 + Math.random() * 900000);

    const paymentData = {
      ...registrationData,
      registrationId,
      registrationFee,
      transactionId: transactionId.trim(),
      paymentStatus: "Payment Submitted",
    };const registrationDocId = sessionStorage.getItem("registrationDocId");

await updateDoc(doc(db, "registrations", registrationDocId), {
  registrationId,
  registrationFee,
  transactionId: transactionId.trim(),
  paymentStatus: "Payment Submitted",
  paymentDate: new Date().toISOString(),
});

    sessionStorage.setItem(
      "registrationData",
      JSON.stringify(paymentData)
    );

    setError("");
    window.location.href = "/event-pass";
  };

  return (
    <div className="payment-page">
      <div className="payment-box">

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

        <p className="payment-label">
          PAYMENT
        </p>

        {/* REGISTRATION FEE */}
        <div className="fee-box">
          <small>REGISTRATION FEE</small>
          <h2>₹{registrationFee}</h2>
        </div>

        {/* PAYMENT AREA */}
        <div className="payment-section">
          <h3>MAKE PAYMENT</h3>

          <p>
            Scan the QR code and complete your payment.
          </p>

          <div className="qr-placeholder">
            <img
              src={paymentQR}
              alt="Payment QR Code"
              className="payment-qr-image"
            />

            <p className="scan-me-text">
              SCAN ME TO PAY
            </p>
          </div>
        </div>

        {/* TRANSACTION ID */}
        <form onSubmit={handleProceed}>
          <div className="transaction-group">
            <label>TRANSACTION ID</label>

            <input
              type="text"
              placeholder="Enter your transaction ID"
              value={transactionId}
              onChange={(e) =>
                setTransactionId(e.target.value)
              }
            />
          </div>

          {/* PAYMENT PROOF */}
          <div className="transaction-group">
            <label>PAYMENT PROOF</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPaymentProof(e.target.files[0])
              }
            />
          </div>

          {error && (
            <p className="payment-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="payment-btn"
          >
            PROCEED
          </button>
        </form>

      </div>
    </div>
  );
}

export default Payment;

