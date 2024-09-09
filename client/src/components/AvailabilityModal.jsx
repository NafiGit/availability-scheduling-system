// src/components/AvailabilityModal.jsx

import React, { useState, useCallback } from "react";
import { useAvailability } from "../context/AvailabilityContext";
import "../styles/calendly-style.css";

const AvailabilityCard = ({ availability, onEdit, onDelete }) => {
  const startTime = new Date(availability.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(availability.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="availability-card">
      <div className="availability-time">
        {startTime} - {endTime}
      </div>
      <div className="availability-duration">
        Duration: {availability.duration} minutes
      </div>
      <div className="availability-actions">
        <button onClick={() => onEdit(availability)}>Edit</button>
        <button onClick={() => onDelete(availability._id)}>Delete</button>
      </div>
    </div>
  );
};

const AvailabilityModal = ({ isOpen, onClose }) => {
  const {
    selectedDate,
    getAvailabilitiesByDate,
    createAvailability,
    updateAvailability,
    deleteAvailability,
  } = useAvailability();
  const [availabilities, setAvailabilities] = useState([]);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [newAvailability, setNewAvailability] = useState({
    start: "",
    end: "",
    duration: 60,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailabilities = useCallback(async () => {
    if (selectedDate && !isLoading) {
      setIsLoading(true);
      console.log(
        "Fetching availabilities for date:",
        selectedDate.toISOString()
      );
      try {
        const dateAvailabilities = await getAvailabilitiesByDate(selectedDate);
        console.log("Availabilities fetched:", dateAvailabilities);

        // duration
        // :
        // 30
        // end
        // :
        // "2024-09-11T11:55:00.000Z"
        // scheduledSlots
        // :
        // []
        // start
        // :
        // "2024-09-11T10:24:00.000Z"
        // user
        // :
        // "66ddcbaa81ff571c78360855"
        // __v
        // :
        // 0
        // _id
        // :
        // "66decce05d273b764e80bd9f"
        // [[Prototype]]
        // :
        // Object
        setAvailabilities(dateAvailabilities);
      } catch (error) {
        console.error("Error fetching availabilities:", error);
      }
      setTimeout(() => setIsLoading(false), 5000); // 5-second cooldown
    }
  }, [selectedDate, getAvailabilitiesByDate, isLoading]);

  const handleCreate = async () => {
    await createAvailability({
      ...newAvailability,
      start: new Date(
        `${selectedDate.toISOString().split("T")[0]}T${newAvailability.start}`
      ),
      end: new Date(
        `${selectedDate.toISOString().split("T")[0]}T${newAvailability.end}`
      ),
    });
    setNewAvailability({ start: "", end: "", duration: 60 });
    fetchAvailabilities();
  };

  const handleUpdate = async () => {
    await updateAvailability(editingAvailability._id, {
      ...editingAvailability,
      start: new Date(
        `${selectedDate.toISOString().split("T")[0]}T${
          editingAvailability.start
        }`
      ),
      end: new Date(
        `${selectedDate.toISOString().split("T")[0]}T${editingAvailability.end}`
      ),
    });
    setEditingAvailability(null);
    fetchAvailabilities();
  };

  const handleDelete = async (id) => {
    await deleteAvailability(id);
    fetchAvailabilities();
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        {selectedDate && (
          <>
            <h2>Availabilities for {selectedDate.toDateString()}</h2>
            <button onClick={fetchAvailabilities} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh Availabilities"}
            </button>
            <div className="availability-cards">
              {availabilities.map((a) => (
                <AvailabilityCard
                  key={a._id}
                  availability={a}
                  onEdit={setEditingAvailability}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {editingAvailability && (
              <div className="edit-availability">
                <h3>Edit Availability</h3>
                <input
                  type="time"
                  value={editingAvailability.start.split("T")[1].slice(0, 5)}
                  onChange={(e) =>
                    setEditingAvailability({
                      ...editingAvailability,
                      start: e.target.value,
                    })
                  }
                />
                <input
                  type="time"
                  value={editingAvailability.end.split("T")[1].slice(0, 5)}
                  onChange={(e) =>
                    setEditingAvailability({
                      ...editingAvailability,
                      end: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  value={editingAvailability.duration}
                  onChange={(e) =>
                    setEditingAvailability({
                      ...editingAvailability,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingAvailability(null)}>
                  Cancel
                </button>
              </div>
            )}
            <div className="new-availability">
              <h3>Add New Availability</h3>
              <input
                type="time"
                value={newAvailability.start}
                onChange={(e) =>
                  setNewAvailability({
                    ...newAvailability,
                    start: e.target.value,
                  })
                }
              />
              <input
                type="time"
                value={newAvailability.end}
                onChange={(e) =>
                  setNewAvailability({
                    ...newAvailability,
                    end: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={newAvailability.duration}
                onChange={(e) =>
                  setNewAvailability({
                    ...newAvailability,
                    duration: parseInt(e.target.value),
                  })
                }
              />
              <button onClick={handleCreate}>Add</button>
            </div>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(AvailabilityModal);
