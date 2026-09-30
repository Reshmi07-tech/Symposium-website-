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
  "Idea Hackathon",
  "Comp Finder",
  "Circuit Debugging",
  "Code Crack",
  "Mind Spark",
];

const NON_TECHNICAL_EVENTS = [
  "E-Sports",
  "Reels Making",
  "Carrom / Volleyball",
  "Sound Track",
  "Blind Cups",
];

const SPECIAL_EVENT = "Fit Tech";

const NON_TECHNICAL_CAPACITY = 20;
const SPECIAL_EVENT_CAPACITY = 20;

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [collegeName, setCollegeName] = useState("");

  const [technicalEvent, setTechnicalEvent] = useState("");
  const [nonTechnicalEvent, setNonTechnicalEvent] = useState("");
  const [specialEvent, setSpecialEvent] = useState("");

  const [foodPreference, setFoodPreference] = useState("");

  const [nonTechnicalCounts, setNonTechnicalCounts] = useState({});
  const [specialEventCount, setSpecialEventCount] = useState(0);

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

        const nonTechnicalData = {};

        // Non-technical events - MAX 20
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

        // Special Event - Fit Tech - MAX 20
        const specialEventId = `special_${SPECIAL_EVENT
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")}`;

        const specialEventRef = doc(
          db,
          "eventCapacity",
          specialEventId
        );

        const specialEventSnap = await getDoc(specialEventRef);

        const specialCount = specialEventSnap.exists()
          ? specialEventSnap.data().count || 0
          : 0;

        setNonTechnicalCounts(nonTechnicalData);
        setSpecialEventCount(specialCount);
      } catch (error) {
        console.error("Failed to fetch event counts:", error);

        setError(
          "Unable to load event availability. Please refresh."
        );
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

    // Personal details
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

    // Technical event is compulsory
    if (!technicalEvent) {
      setError("Please select one Technical Event.");
      return;
    }

    // Non-technical event is optional

    // Special event is optional

    // Food preference
    if (!foodPreference) {
      setError("Please select your Food Preference.");
      return;
    }

    // Check Non-Technical capacity
    if (
      nonTechnicalEvent &&
      nonTechnicalCounts[nonTechnicalEvent] >=
        NON_TECHNICAL_CAPACITY
    ) {
      setError(
        "The selected Non-Technical Event is FULL. Please select another event."
      );
      return;
    }

    // Check Special Event capacity
    if (
      specialEvent &&
      specialEventCount >= SPECIAL_EVENT_CAPACITY
    ) {
      setError(
        "Fit Tech is FULL. Please continue without the Special Event."
      );
      return;
    }

    try {
      setProcessing(true);

      // Technical event - unlimited
      const technicalEventId = createEventId(
        "technical",
        technicalEvent
      );

      const technicalRef = doc(
        db,
        "eventCapacity",
        technicalEventId
      );

      // Non-technical event
      let nonTechnicalRef = null;

      if (nonTechnicalEvent) {
        const nonTechnicalEventId = createEventId(
          "nonTechnical",
          nonTechnicalEvent
        );

        nonTechnicalRef = doc(
          db,
          "eventCapacity",
          nonTechnicalEventId
        );
      }

      // Special event - Fit Tech
      let specialEventRef = null;

      if (specialEvent) {
        const specialEventId = createEventId(
          "special",
          specialEvent
        );

        specialEventRef = doc(
          db,
          "eventCapacity",
          specialEventId
        );
      }

      // Registration document
      const registrationRef = doc(
        collection(db, "registrations")
      );

      await runTransaction(db, async (transaction) => {
        /* =========================
           TECHNICAL EVENT
           NO LIMIT
        ========================= */

        const technicalSnap =
          await transaction.get(technicalRef);

        const technicalCurrentCount =
          technicalSnap.exists()
            ? technicalSnap.data().count || 0
            : 0;

        /* =========================
           NON-TECHNICAL EVENT
           LIMIT 20
        ========================= */

        let nonTechnicalCurrentCount = 0;
        let nonTechnicalSnap = null;

        if (nonTechnicalRef) {
          nonTechnicalSnap =
            await transaction.get(nonTechnicalRef);

          nonTechnicalCurrentCount =
            nonTechnicalSnap.exists()
              ? nonTechnicalSnap.data().count || 0
              : 0;

          if (
            nonTechnicalCurrentCount >=
            NON_TECHNICAL_CAPACITY
          ) {
            throw new Error(
              `NON_TECHNICAL_FULL:${nonTechnicalEvent}`
            );
          }
        }

        /* =========================
           SPECIAL EVENT
           FIT TECH - LIMIT 20
        ========================= */

        let specialCurrentCount = 0;
        let specialSnap = null;

        if (specialEventRef) {
          specialSnap =
            await transaction.get(specialEventRef);

          specialCurrentCount = specialSnap.exists()
            ? specialSnap.data().count || 0
            : 0;

          if (
            specialCurrentCount >=
            SPECIAL_EVENT_CAPACITY
          ) {
            throw new Error(
              "SPECIAL_EVENT_FULL:Fit Tech"
            );
          }
        }

        /* =========================
           UPDATE TECHNICAL COUNT
           NO CAPACITY CHECK
        ========================= */

        transaction.set(
          technicalRef,
          {
            eventType: "Technical",
            eventName: technicalEvent,
            count: technicalCurrentCount + 1,
          },
          { merge: true }
        );

        /* =========================
           UPDATE NON-TECHNICAL COUNT
        ========================= */

        if (nonTechnicalRef) {
          transaction.set(
            nonTechnicalRef,
            {
              eventType: "Non-Technical",
              eventName: nonTechnicalEvent,
              count: nonTechnicalCurrentCount + 1,
              capacity: NON_TECHNICAL_CAPACITY,
            },
            { merge: true }
          );
        }

        /* =========================
           UPDATE SPECIAL EVENT COUNT
        ========================= */

        if (specialEventRef) {
          transaction.set(
            specialEventRef,
            {
              eventType: "Special Event",
              eventName: specialEvent,
              count: specialCurrentCount + 1,
              capacity: SPECIAL_EVENT_CAPACITY,
            },
            { merge: true }
          );
        }

        /* =========================
           REGISTRATION DOCUMENT
        ========================= */

        transaction.set(registrationRef, {
          fullName,
          email,
          phone,
          department,
          collegeName,

          technicalEvent,

          nonTechnicalEvent:
            nonTechnicalEvent || "",

          specialEvent: specialEvent || "",

          foodPreference,

          registrationDate:
            new Date().toISOString(),

          approvalStatus: "Pending",
          paymentStatus: "Pending",
        });
      });

      /* =========================
         SESSION STORAGE
      ========================= */

      const registrationData = {
        fullName,
        email,
        phone,
        department,
        collegeName,

        technicalEvent,

        nonTechnicalEvent:
          nonTechnicalEvent || "",

        specialEvent:
          specialEvent || "",

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

      /* =========================
         GO TO PAYMENT
      ========================= */

      window.location.href = "/payment";
    } catch (error) {
      console.error("Registration failed:", error);

      /* =========================
         NON-TECHNICAL FULL
      ========================= */

      if (
        error.message?.startsWith(
          "NON_TECHNICAL_FULL:"
        )
      ) {
        const fullEvent =
          error.message.replace(
            "NON_TECHNICAL_FULL:",
            ""
          );

        setNonTechnicalCounts((prev) => ({
          ...prev,
          [fullEvent]: NON_TECHNICAL_CAPACITY,
        }));

        setNonTechnicalEvent("");

        setError(
          `${fullEvent} is FULL. Please select another Non-Technical Event.`
        );
      }

      /* =========================
         SPECIAL EVENT FULL
      ========================= */

      else if (
        error.message?.startsWith(
          "SPECIAL_EVENT_FULL:"
        )
      ) {
        setSpecialEventCount(
          SPECIAL_EVENT_CAPACITY
        );

        setSpecialEvent("");

        setError(
          "Fit Tech is FULL. Please continue without the Special Event."
        );
      }

      /* =========================
         OTHER ERROR
      ========================= */

      else {
        setError(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  /* =========================
     EVENT COUNT
  ========================= */

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

          {/* =========================
              PERSONAL DETAILS
          ========================= */}

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="College Name"
            value={collegeName}
            onChange={(e) =>
              setCollegeName(e.target.value)
            }
          />

          {/* =========================
              FOOD PREFERENCE
          ========================= */}

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
                  checked={
                    foodPreference === "Veg"
                  }
                  onChange={(e) =>
                    setFoodPreference(
                      e.target.value
                    )
                  }
                />

                <span>🥬 Veg</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Non-Veg"
                  checked={
                    foodPreference === "Non-Veg"
                  }
                  onChange={(e) =>
                    setFoodPreference(
                      e.target.value
                    )
                  }
                />

                <span>🍗 Non-Veg</span>
              </label>

            </div>
          </div>

          {/* =========================
              TECHNICAL EVENTS
          ========================= */}

          <div className="event-section">

            <h2>TECHNICAL EVENTS</h2>

            <p className="event-note">
              Select any ONE technical event
              (Compulsory)
            </p>

            {loadingCounts ? (
              <p className="event-note">
                Loading availability...
              </p>
            ) : (
              <div className="event-list">

                {TECHNICAL_EVENTS.map((event) => (
                  <label
                    key={event}
                    className="event-available"
                  >
                    <input
                      type="radio"
                      name="technicalEvent"
                      value={event}
                      checked={
                        technicalEvent === event
                      }
                      onChange={(e) =>
                        setTechnicalEvent(
                          e.target.value
                        )
                      }
                    />

                    <span>{event}</span>
                  </label>
                ))}

              </div>
            )}

          </div>

          {/* =========================
              NON-TECHNICAL EVENTS
          ========================= */}

          <div className="event-section">

            <h2>NON-TECHNICAL EVENTS</h2>

            <p className="event-note">
              Select any ONE non-technical event
              (Optional)
            </p>

            {loadingCounts ? (
              <p className="event-note">
                Loading availability...
              </p>
            ) : (
              <div className="event-list">

                {NON_TECHNICAL_EVENTS.map(
                  (event) => {
                    const count =
                      getNonTechnicalCount(
                        event
                      );

                    const isFull =
                      count >=
                      NON_TECHNICAL_CAPACITY;

                    return (
                      <label
                        key={event}
                        className={
                          isFull
                            ? "event-full"
                            : ""
                        }
                      >

                        <input
                          type="radio"
                          name="nonTechnicalEvent"
                          value={event}
                          checked={
                            nonTechnicalEvent ===
                            event
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
                              : `${count}/${NON_TECHNICAL_CAPACITY}`}
                          </small>
                        </span>

                      </label>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* =========================
              SPECIAL EVENT
          ========================= */}

          <div className="event-section">

            <h2>SPECIAL EVENT</h2>

            <p className="event-note">
              Select Special Event (Optional)
            </p>

            {loadingCounts ? (
              <p className="event-note">
                Loading availability...
              </p>
            ) : (
              <div className="event-list">

                <label
                  className={
                    specialEventCount >=
                    SPECIAL_EVENT_CAPACITY
                      ? "event-full"
                      : "event-available"
                  }
                >

                  <input
                    type="radio"
                    name="specialEvent"
                    value={SPECIAL_EVENT}
                    checked={
                      specialEvent ===
                      SPECIAL_EVENT
                    }
                    disabled={
                      specialEventCount >=
                      SPECIAL_EVENT_CAPACITY
                    }
                    onChange={(e) =>
                      setSpecialEvent(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    🏃 {SPECIAL_EVENT}

                    <small
                      className={
                        specialEventCount >=
                        SPECIAL_EVENT_CAPACITY
                          ? "event-full-count"
                          : "event-seat-count"
                      }
                    >
                      {specialEventCount >=
                      SPECIAL_EVENT_CAPACITY
                        ? "FULL 🔒"
                        : `${specialEventCount}/${SPECIAL_EVENT_CAPACITY}`}
                    </small>
                  </span>

                </label>

              </div>
            )}

          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <p className="event-error">
              {error}
            </p>
          )}

          {/* =========================
              SUBMIT
          ========================= */}

          <button
            type="submit"
            className="submit-btn"
            disabled={
              processing || loadingCounts
            }
          >
            {processing
              ? "PROCESSING..."
              : "CONTINUE"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;