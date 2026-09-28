
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import departmentLogo from "./department-logo.jpeg";

const TECHNICAL_EVENTS = [
  "Paper Presentation",
  "Project Expo",
  "Coding Challenge",
  "Circuit Debugging",
  "Technical Quiz",
];

const NON_TECHNICAL_EVENTS = [
  "Connections",
  "Treasure Hunt",
  "Dumb Charades",
  "Photography",
  "Meme Creation",
];

const CAPACITY = 10;

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [collegeName, setCollegeName] = useState("");

  const [technicalEvent, setTechnicalEvent] = useState("");
  const [nonTechnicalEvent, setNonTechnicalEvent] = useState("");
  const [foodPreference, setFoodPreference] = useState("");

  const [technicalCounts, setTechnicalCounts] = useState({});
  const [nonTechnicalCounts, setNonTechnicalCounts] = useState({});

  const [loadingCounts, setLoadingCounts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     FETCH EVENT COUNTS
  ========================= */

  useEffect(() => {
    const fetchEventCounts = async () => {
      try {
        setLoadingCounts(true);

        const technicalData = {};
        const nonTechnicalData = {};

        for (const eventName of TECHNICAL_EVENTS) {
          const eventId = `technical_${eventName
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_]/g, "")}`;

          const eventRef = doc(db, "eventCapacity", eventId);
          const eventSnap = await getDoc(eventRef);

          technicalData[eventName] = eventSnap.exists()
            ? eventSnap.data().count || 0
            : 0;
        }

        for (const eventName of NON_TECHNICAL_EVENTS) {
          const eventId = `nonTechnical_${eventName
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_]/g, "")}`;

          const eventRef = doc(db, "eventCapacity", eventId);
          const eventSnap = await getDoc(eventRef);

          nonTechnicalData[eventName] = eventSnap.exists()
            ? eventSnap.data().count || 0
            : 0;
        }

        setTechnicalCounts(technicalData);
        setNonTechnicalCounts(nonTechnicalData);
      } catch (error) {
        console.error("Failed to fetch event counts:", error);
        setError("Unable to load event availability. Please refresh.");
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchEventCounts();
  }, []);

  /* =========================
     EVENT ID
  ========================= */

  const createEventId = (type, eventName) => {
    return `${type}_${eventName
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")}`;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !fullName ||
      !email ||
      !phone ||
      !department ||
      !collegeName
    ) {
      setError("Please fill all personal details.");
      return;
    }

    if (!technicalEvent || !nonTechnicalEvent) {
      setError(
        "Please select one Technical Event and one Non-Technical Event."
      );
      return;
    }

    if (!foodPreference) {
      setError("Please select your Food Preference.");
      return;
    }

    if (
      technicalCounts[technicalEvent] >= CAPACITY ||
      nonTechnicalCounts[nonTechnicalEvent] >= CAPACITY
    ) {
      setError(
        "One of your selected events is already FULL. Please select another event."
      );
      return;
    }

    try {
      setProcessing(true);

      const technicalEventId = createEventId(
        "technical",
        technicalEvent
      );

      const nonTechnicalEventId = createEventId(
        "nonTechnical",
        nonTechnicalEvent
      );

      const technicalRef = doc(
        db,
        "eventCapacity",
        technicalEventId
      );

      const nonTechnicalRef = doc(
        db,
        "eventCapacity",
        nonTechnicalEventId
      );

      const registrationRef = doc(
        collection(db, "registrations")
      );

      await runTransaction(db, async (transaction) => {
        const technicalSnap = await transaction.get(technicalRef);
        const nonTechnicalSnap = await transaction.get(
          nonTechnicalRef
        );

        const technicalCurrentCount = technicalSnap.exists()
          ? technicalSnap.data().count || 0
          : 0;

        const nonTechnicalCurrentCount = nonTechnicalSnap.exists()
          ? nonTechnicalSnap.data().count || 0
          : 0;

        if (technicalCurrentCount >= CAPACITY) {
          throw new Error(
            `TECHNICAL_FULL:${technicalEvent}`
          );
        }

        if (nonTechnicalCurrentCount >= CAPACITY) {
          throw new Error(
            `NON_TECHNICAL_FULL:${nonTechnicalEvent}`
          );
        }

        transaction.set(
          technicalRef,
          {
            eventType: "Technical",
            eventName: technicalEvent,
            count: technicalCurrentCount + 1,
            capacity: CAPACITY,
          },
          { merge: true }
        );

        transaction.set(
          nonTechnicalRef,
          {
            eventType: "Non-Technical",
            eventName: nonTechnicalEvent,
            count: nonTechnicalCurrentCount + 1,
            capacity: CAPACITY,
          },
          { merge: true }
        );

        transaction.set(registrationRef, {
          fullName,
          email,
          phone,
          department,
          collegeName,
          technicalEvent,
          nonTechnicalEvent,
          foodPreference,
          registrationDate: new Date().toISOString(),
          approvalStatus: "Pending",
          paymentStatus: "Pending",
        });
      });

      const registrationData = {
        fullName,
        email,
        phone,
        department,
        collegeName,
        technicalEvent,
        nonTechnicalEvent,
        foodPreference,
      };

      sessionStorage.setItem(
        "registrationDocId",
        registrationRef.id
      );

      sessionStorage.setItem(
        "registrationData",
        JSON.stringify(registrationData)
      );

      window.location.href = "/payment";
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.message?.startsWith("TECHNICAL_FULL:")) {
        const fullEvent = error.message.replace(
          "TECHNICAL_FULL:",
          ""
        );

        setTechnicalCounts((prev) => ({
          ...prev,
          [fullEvent]: CAPACITY,
        }));

        setTechnicalEvent("");

        setError(
          `${fullEvent} is FULL. Please select another Technical Event.`
        );
      } else if (
        error.message?.startsWith("NON_TECHNICAL_FULL:")
      ) {
        const fullEvent = error.message.replace(
          "NON_TECHNICAL_FULL:",
          ""
        );

        setNonTechnicalCounts((prev) => ({
          ...prev,
          [fullEvent]: CAPACITY,
        }));

        setNonTechnicalEvent("");

        setError(
          `${fullEvent} is FULL. Please select another Non-Technical Event.`
        );
      } else {
        setError(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  /* =========================
     EVENT COUNT DISPLAY
  ========================= */

  const getTechnicalCount = (eventName) => {
    return technicalCounts[eventName] || 0;
  };

  const getNonTechnicalCount = (eventName) => {
    return nonTechnicalCounts[eventName] || 0;
  };

  return (
    <div className="register-page">
      <div className="register-box">

        {/* TITLE */}

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

          {/* PERSONAL DETAILS */}

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            type="text"
            placeholder="College Name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />

          {/* FOOD PREFERENCE */}

          <div className="event-section">
            <h2>FOOD PREFERENCE</h2>

            <p className="event-note">
              Select your food preference
            </p>

            <div className="event-list">

              <label>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Veg"
                  checked={foodPreference === "Veg"}
                  onChange={(e) =>
                    setFoodPreference(e.target.value)
                  }
                />
                <span>🥬 Veg</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Non-Veg"
                  checked={foodPreference === "Non-Veg"}
                  onChange={(e) =>
                    setFoodPreference(e.target.value)
                  }
                />
                <span>🍗 Non-Veg</span>
              </label>

            </div>
          </div>

          {/* TECHNICAL EVENTS */}

          <div className="event-section">
            <h2>TECHNICAL EVENTS</h2>

            <p className="event-note">
              Select any ONE technical event
            </p>

            {loadingCounts ? (
              <p className="event-note">
                Loading availability...
              </p>
            ) : (
              <div className="event-list">

                {TECHNICAL_EVENTS.map((event) => {
                  const count = getTechnicalCount(event);
                  const isFull = count >= CAPACITY;

                  return (
                    <label
                      key={event}
                      className={isFull ? "event-full" : ""}
                    >
                      <input
                        type="radio"
                        name="technicalEvent"
                        value={event}
                        checked={technicalEvent === event}
                        disabled={isFull}
                        onChange={(e) =>
                          setTechnicalEvent(e.target.value)
                        }
                      />

                      <span>
                        {event}

                        <small
                          className={
                            isFull
                              ? "event-full-count"
                              : "event-seat-count"
                          }
                        >
                          {isFull
                            ? "FULL 🔒"
                            : `${count}/${CAPACITY}`}
                        </small>
                      </span>
                    </label>
                  );
                })}

              </div>
            )}
          </div>

          {/* NON-TECHNICAL EVENTS */}

          <div className="event-section">
            <h2>NON-TECHNICAL EVENTS</h2>

            <p className="event-note">
              Select any ONE non-technical event
            </p>

            {loadingCounts ? (
              <p className="event-note">
                Loading availability...
              </p>
            ) : (
              <div className="event-list">

                {NON_TECHNICAL_EVENTS.map((event) => {
                  const count = getNonTechnicalCount(event);
                  const isFull = count >= CAPACITY;

                  return (
                    <label
                      key={event}
                      className={isFull ? "event-full" : ""}
                    >
                      <input
                        type="radio"
                        name="nonTechnicalEvent"
                        value={event}
                        checked={
                          nonTechnicalEvent === event
                        }
                        disabled={isFull}
                        onChange={(e) =>
                          setNonTechnicalEvent(
                            e.target.value
                          )
                        }
                      />

                      <span>
                        {event}

                        <small
                          className={
                            isFull
                              ? "event-full-count"
                              : "event-seat-count"
                          }
                        >
                          {isFull
                            ? "FULL 🔒"
                            : `${count}/${CAPACITY}`}
                        </small>
                      </span>
                    </label>
                  );
                })}

              </div>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <p className="event-error">
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-btn"
            disabled={processing || loadingCounts}
          >
            {processing ? "PROCESSING..." : "CONTINUE"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;
