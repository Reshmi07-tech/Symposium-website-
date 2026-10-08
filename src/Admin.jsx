import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  runTransaction,
  updateDoc,
  
} from "firebase/firestore";

import { db } from "./firebase";
import "./Admin.css";

function Admin() {
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState("All");

  const technicalEvents = [
    "Idea Hackathon",
    "Comp Finder",
    "Circuit Debugging",
    "Code Crack",
    "Mind Spark",
  ];

  const nonTechnicalEvents = [
    "E-Sports",
    "Reels Making",
    "Carrom / Volleyball",
    "Sound Track",
    "Blind Cups",
  ];

  const specialEvents = ["Fit Tech"];

  const NON_TECHNICAL_CAPACITY = 20;
  const SPECIAL_EVENT_CAPACITY = 20;

  // ----------------------------------------
  // CREATE EVENT CAPACITY DOCUMENT ID
  // Same logic as Register.jsx
  // ----------------------------------------
  const createEventId = (type, eventName) => {
    return `${type}_${eventName
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")}`;
  };

  // ----------------------------------------
  // APPROVE REGISTRATION
  // ----------------------------------------
  const handleApprove = async (registrationId) => {
    try {
      await updateDoc(
        doc(db, "registrations", registrationId),
        {
          approvalStatus: "Approved",
        }
      );

      setRegistrations((prev) =>
        prev.map((registration) =>
          registration.id === registrationId
            ? {
                ...registration,
                approvalStatus: "Approved",
              }
            : registration
        )
      );
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  // ----------------------------------------
  // DELETE REGISTRATION
  // AND DECREASE EVENT CAPACITY COUNT
  // ----------------------------------------
  const handleDelete = async (registrationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this registration?"
    );

    if (!confirmDelete) return;

    try {
      // Find the registration before deleting
      const registration = registrations.find(
        (item) => item.id === registrationId
      );

      if (!registration) {
        alert("Registration not found.");
        return;
      }

      // Registration document reference
      const registrationRef = doc(
        db,
        "registrations",
        registrationId
      );

      // ----------------------------------------
      // TECHNICAL EVENT REF
      // ----------------------------------------
      let technicalRef = null;

      if (registration.technicalEvent) {
        const technicalEventId = createEventId(
          "technical",
          registration.technicalEvent
        );

        technicalRef = doc(
          db,
          "eventCapacity",
          technicalEventId
        );
      }

      // ----------------------------------------
      // NON-TECHNICAL EVENT REF
      // ----------------------------------------
      let nonTechnicalRef = null;

      if (registration.nonTechnicalEvent) {
        const nonTechnicalEventId = createEventId(
          "nonTechnical",
          registration.nonTechnicalEvent
        );

        nonTechnicalRef = doc(
          db,
          "eventCapacity",
          nonTechnicalEventId
        );
      }

      // ----------------------------------------
      // SPECIAL EVENT REF
      // ----------------------------------------
      let specialEventRef = null;

      if (registration.specialEvent) {
        const specialEventId = createEventId(
          "special",
          registration.specialEvent
        );

        specialEventRef = doc(
          db,
          "eventCapacity",
          specialEventId
        );
      }

      // ----------------------------------------
      // FIRESTORE TRANSACTION
      // ----------------------------------------
      await runTransaction(db, async (transaction) => {
        // IMPORTANT:
        // First READ all documents
        // Then WRITE all documents

        let technicalSnap = null;
        let nonTechnicalSnap = null;
        let specialSnap = null;

        // ----------------------------------------
        // READ TECHNICAL COUNT
        // ----------------------------------------
        if (technicalRef) {
          technicalSnap = await transaction.get(
            technicalRef
          );
        }

        // ----------------------------------------
        // READ NON-TECHNICAL COUNT
        // ----------------------------------------
        if (nonTechnicalRef) {
          nonTechnicalSnap = await transaction.get(
            nonTechnicalRef
          );
        }

        // ----------------------------------------
        // READ SPECIAL EVENT COUNT
        // ----------------------------------------
        if (specialEventRef) {
          specialSnap = await transaction.get(
            specialEventRef
          );
        }

        // ----------------------------------------
        // DECREASE TECHNICAL COUNT
        // ----------------------------------------
        if (
          technicalRef &&
          technicalSnap &&
          technicalSnap.exists()
        ) {
          const currentCount =
            technicalSnap.data().count || 0;

          const newCount = Math.max(
            0,
            currentCount - 1
          );

          transaction.update(technicalRef, {
            count: newCount,
          });
        }

        // ----------------------------------------
        // DECREASE NON-TECHNICAL COUNT
        // ----------------------------------------
        if (
          nonTechnicalRef &&
          nonTechnicalSnap &&
          nonTechnicalSnap.exists()
        ) {
          const currentCount =
            nonTechnicalSnap.data().count || 0;

          const newCount = Math.max(
            0,
            currentCount - 1
          );

          transaction.update(nonTechnicalRef, {
            count: newCount,
          });
        }

        // ----------------------------------------
        // DECREASE SPECIAL EVENT COUNT
        // ----------------------------------------
        if (
          specialEventRef &&
          specialSnap &&
          specialSnap.exists()
        ) {
          const currentCount =
            specialSnap.data().count || 0;

          const newCount = Math.max(
            0,
            currentCount - 1
          );

          transaction.update(specialEventRef, {
            count: newCount,
          });
        }

        // ----------------------------------------
        // DELETE REGISTRATION
        // ----------------------------------------
        transaction.delete(registrationRef);
      });

      // ----------------------------------------
      // UPDATE ADMIN PAGE UI
      // ----------------------------------------
      setRegistrations((prev) =>
        prev.filter(
          (registration) =>
            registration.id !== registrationId
        )
      );

      alert(
        "Registration deleted and event count updated successfully!"
      );
    } catch (error) {
      console.error("Delete failed:", error);

      alert(
        "Delete failed. Please check Firebase and try again."
      );
    }
  };

  // ----------------------------------------
  // FETCH REGISTRATIONS
  // ----------------------------------------
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "registrations")
        );

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRegistrations(data);
      } catch (error) {
        console.error(
          "Failed to fetch registrations:",
          error
        );
      }
    };

    fetchRegistrations();
  }, []);

  // ----------------------------------------
  // FOOD COUNTS
  // ----------------------------------------
  const vegCount = registrations.filter(
    (registration) => {
      const food = String(
        registration.foodPreference || ""
      )
        .trim()
        .toLowerCase();

      return food === "veg";
    }
  ).length;

  const nonVegCount = registrations.filter(
    (registration) => {
      const food = String(
        registration.foodPreference || ""
      )
        .trim()
        .toLowerCase();

      return (
        food === "non-veg" ||
        food === "non veg" ||
        food === "nonveg"
      );
    }
  ).length;

  // ----------------------------------------
  // GET EVENT COUNT FOR ADMIN DISPLAY
  // ----------------------------------------
  const getEventCount = (eventName) => {
    return registrations.filter(
      (registration) =>
        registration.technicalEvent === eventName ||
        registration.nonTechnicalEvent === eventName ||
        registration.specialEvent === eventName
    ).length;
  };

  // ----------------------------------------
  // FILTER REGISTRATIONS
  // ----------------------------------------
  const filteredRegistrations =
    registrations.filter((registration) => {
      if (filter === "All") {
        return true;
      }

      if (filter === "Approved") {
        return (
          registration.approvalStatus === "Approved"
        );
      }

      if (filter === "Pending") {
        return (
          registration.approvalStatus !== "Approved"
        );
      }

      return true;
    });

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div className="admin-page">
      <h1>ECLECTIC'26 ADMIN</h1>

      <p className="admin-total">
        Total Registrations: {registrations.length}
      </p>

      {/* FOOD COUNT */}
      <div className="admin-stats-section">
        <h2>FOOD COUNT</h2>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>🥬 VEG</h3>
            <p>{vegCount}</p>
          </div>

          <div className="admin-stat-card">
            <h3>🍗 NON-VEG</h3>
            <p>{nonVegCount}</p>
          </div>
        </div>
      </div>

      {/* TECHNICAL EVENTS */}
      <div className="admin-events-section">
        <h2>TECHNICAL EVENTS</h2>

        <div className="admin-event-grid">
          {technicalEvents.map((event) => {
            const count = getEventCount(event);

            return (
              <div
                key={event}
                className="admin-event-card"
              >
                <h3>{event}</h3>

                <p>
                  <strong>{count}</strong> Registered
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* NON-TECHNICAL EVENTS */}
      <div className="admin-events-section">
        <h2>NON-TECHNICAL EVENTS</h2>

        <div className="admin-event-grid">
          {nonTechnicalEvents.map((event) => {
            const count = getEventCount(event);

            const isFull =
              count >= NON_TECHNICAL_CAPACITY;

            return (
              <div
                key={event}
                className={`admin-event-card ${
                  isFull ? "event-full" : ""
                }`}
              >
                <h3>{event}</h3>

                <p>
                  <strong>{count}</strong> /{" "}
                  {NON_TECHNICAL_CAPACITY}
                </p>

                {isFull && (
                  <span className="full-badge">
                    🔒 FULL
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SPECIAL EVENT */}
      <div className="admin-events-section">
        <h2>SPECIAL EVENT</h2>

        <div className="admin-event-grid">
          {specialEvents.map((event) => {
            const count = getEventCount(event);

            const isFull =
              count >= SPECIAL_EVENT_CAPACITY;

            return (
              <div
                key={event}
                className={`admin-event-card ${
                  isFull ? "event-full" : ""
                }`}
              >
                <h3>{event}</h3>

                <p>
                  <strong>{count}</strong> /{" "}
                  {SPECIAL_EVENT_CAPACITY}
                </p>

                {isFull && (
                  <span className="full-badge">
                    🔒 FULL
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="admin-filters">
        <button
          onClick={() => setFilter("All")}
        >
          All
        </button>

        <button
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("Approved")}
        >
          Approved
        </button>
      </div>

      {/* REGISTRATION CARDS */}
      {filteredRegistrations.map(
        (registration) => (
          <div
            key={registration.id}
            className="admin-card"
          >
            <h2>{registration.fullName}</h2>

            <p>
              <strong>Email:</strong>{" "}
              {registration.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {registration.phone}
            </p>

            <p>
              <strong>College:</strong>{" "}
              {registration.collegeName}
            </p>

            <p>
              <strong>Technical:</strong>{" "}
              {registration.technicalEvent}
            </p>

            <p>
              <strong>Non-Technical:</strong>{" "}
              {registration.nonTechnicalEvent ||
                "Not selected"}
            </p>

            <p>
              <strong>Special Event:</strong>{" "}
              {registration.specialEvent ||
                "Not selected"}
            </p>

            <p>
              <strong>Food Preference:</strong>{" "}
              {registration.foodPreference ||
                "Not selected"}
            </p>

            <p>
              <strong>Transaction ID:</strong>{" "}
              {registration.transactionId ||
                "Not submitted"}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={
                  registration.paymentStatus ===
                  "Payment Submitted"
                    ? "status-badge submitted"
                    : "status-badge pending"
                }
              >
                {registration.paymentStatus ||
                  "Pending"}
              </span>
            </p>

            <p>
              <strong>Registration ID:</strong>{" "}
              {registration.registrationId ||
                "Not generated"}
            </p>

            <p>
              <strong>Approval Status:</strong>{" "}
              <span
                className={
                  registration.approvalStatus ===
                  "Approved"
                    ? "status-badge submitted"
                    : "status-badge pending"
                }
              >
                {registration.approvalStatus ||
                  "Pending"}
              </span>
            </p>

            {/* APPROVE BUTTON */}
            <button
              className="approve-btn"
              onClick={() =>
                handleApprove(registration.id)
              }
              disabled={
                registration.approvalStatus ===
                "Approved"
              }
            >
              {registration.approvalStatus ===
              "Approved"
                ? "✓ Approved"
                : "Approve Registration"}
            </button>

            {/* DELETE BUTTON */}
            <button
              className="delete-btn"
              onClick={() =>
                handleDelete(registration.id)
              }
            >
              Delete Registration
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Admin;