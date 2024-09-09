import React, { useState, useEffect } from 'react';
import { useAvailability } from '../context/AvailabilityContext';
import '../styles/calendly-style.css';

const AvailabilityModal = ({ isOpen, onClose }) => {
  const { selectedDate, getAvailabilitiesByDate, createAvailability, updateAvailability, deleteAvailability } = useAvailability();
  const [availabilities, setAvailabilities] = useState([]);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [newAvailability, setNewAvailability] = useState({ start: '', end: '', duration: 60 });

  useEffect(() => {
    if (selectedDate && isOpen) {
      fetchAvailabilities();
    }
  }, [selectedDate, isOpen]);

  const fetchAvailabilities = async () => {
    const dateAvailabilities = await getAvailabilitiesByDate(selectedDate);
    setAvailabilities(dateAvailabilities);
  };

  const handleCreate = async () => {
    await createAvailability({
      ...newAvailability,
      start: new Date(`${selectedDate.toISOString().split('T')[0]}T${newAvailability.start}`),
      end: new Date(`${selectedDate.toISOString().split('T')[0]}T${newAvailability.end}`),
    });
    setNewAvailability({ start: '', end: '', duration: 60 });
    fetchAvailabilities();
  };

  const handleUpdate = async () => {
    await updateAvailability(editingAvailability._id, {
      ...editingAvailability,
      start: new Date(`${selectedDate.toISOString().split('T')[0]}T${editingAvailability.start}`),
      end: new Date(`${selectedDate.toISOString().split('T')[0]}T${editingAvailability.end}`),
    });
    setEditingAvailability(null);
    fetchAvailabilities();
  };

  const handleDelete = async (id) => {
    await deleteAvailability(id);
    fetchAvailabilities();
  };

  if (!isOpen) return null;

  return (
    <div className="modal open">
      <div className="modal-content">
        <h2>Availabilities for {selectedDate.toDateString()}</h2>
        <ul>
          {availabilities.map(a => (
            <li key={a._id}>
              {editingAvailability && editingAvailability._id === a._id ? (
                <>
                  <input
                    type="time"
                    value={editingAvailability.start.split('T')[1].slice(0, 5)}
                    onChange={(e) => setEditingAvailability({...editingAvailability, start: e.target.value})}
                  />
                  <input
                    type="time"
                    value={editingAvailability.end.split('T')[1].slice(0, 5)}
                    onChange={(e) => setEditingAvailability({...editingAvailability, end: e.target.value})}
                  />
                  <input
                    type="number"
                    value={editingAvailability.duration}
                    onChange={(e) => setEditingAvailability({...editingAvailability, duration: parseInt(e.target.value)})}
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingAvailability(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {new Date(a.start).toLocaleTimeString()} - {new Date(a.end).toLocaleTimeString()}
                  (Duration: {a.duration} minutes)
                  <button onClick={() => setEditingAvailability(a)}>Edit</button>
                  <button onClick={() => handleDelete(a._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
        <h3>Add New Availability</h3>
        <input
          type="time"
          value={newAvailability.start}
          onChange={(e) => setNewAvailability({...newAvailability, start: e.target.value})}
        />
        <input
          type="time"
          value={newAvailability.end}
          onChange={(e) => setNewAvailability({...newAvailability, end: e.target.value})}
        />
        <input
          type="number"
          value={newAvailability.duration}
          onChange={(e) => setNewAvailability({...newAvailability, duration: parseInt(e.target.value)})}
        />
        <button onClick={handleCreate}>Add</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AvailabilityModal;
