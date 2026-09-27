import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./Admin.css";

function Admin() {
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState("All");

  const handleApprove = async (registrationId) => {
    try {
      await updateDoc(doc(db, "registrations", registrationId), {
        approvalStatus: "Approved",
      });

      setRegistrations((prev) =>
        prev.map((registration) =>
          registration.id === registrationId
            ? { ...registration, approvalStatus: "Approved" }
            : registration
        )
      );
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };
  const handleDelete = async (registrationId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this registration?"
  );

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "registrations", registrationId));

    setRegistrations((prev) =>
      prev.filter((registration) => registration.id !== registrationId)
    );
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

  useEffect(() => {
    const fetchRegistrations = async () => {
      const snapshot = await getDocs(collection(db, "registrations"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRegistrations(data);
    };

    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((registration) => {
    if (filter === "All") return true;

    if (filter === "Approved") {
      return registration.approvalStatus === "Approved";
    }

    if (filter === "Pending") {
      return registration.approvalStatus !== "Approved";
    }

    return true;
  });

  return (
    <div className="admin-page">
      <h1>ECLECTIC'26 ADMIN</h1>

      <p>Total Registrations: {registrations.length}</p>

      <div className="admin-filters">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Approved")}>Approved</button>
      </div>

      {filteredRegistrations.map((registration) => (
        <div key={registration.id} className="admin-card">
          <h2>{registration.fullName}</h2>

          <p>
            <strong>Email:</strong> {registration.email}
          </p>

          <p>
            <strong>Phone:</strong> {registration.phone}
          </p>

          <p>
            <strong>College:</strong> {registration.collegeName}
          </p>

          <p>
            <strong>Technical:</strong> {registration.technicalEvent}
          </p>

          <p>
            <strong>Non-Technical:</strong> {registration.nonTechnicalEvent}
          </p>

          <p>
            <strong>Transaction ID:</strong>{" "}
            {registration.transactionId || "Not submitted"}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              className={
                registration.paymentStatus === "Payment Submitted"
                  ? "status-badge submitted"
                  : "status-badge pending"
              }
            >
              {registration.paymentStatus || "Pending"}
            </span>
          </p>

          <p>
            <strong>Registration ID:</strong>{" "}
            {registration.registrationId || "Not generated"}
          </p>

          <p>
            <strong>Approval Status:</strong>{" "}
            <span
              className={
                registration.approvalStatus === "Approved"
                  ? "status-badge submitted"
                  : "status-badge pending"
              }
            >
              {registration.approvalStatus || "Pending"}
            </span>
          </p>

          <button
            className="approve-btn"
            onClick={() => handleApprove(registration.id)}
            disabled={registration.approvalStatus === "Approved"}
          >
            {registration.approvalStatus === "Approved"
              ? "✓ Approved"
              : "Approve Registration"}
          </button>
          <button
  className="delete-btn"
  onClick={() => handleDelete(registration.id)}
>
  Delete Registration
</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;