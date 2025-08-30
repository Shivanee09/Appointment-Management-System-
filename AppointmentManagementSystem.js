import  { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: "", description: "", date: "", time: "" });
  const [isEditMode, setIsEditMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: isEditMode ? formData.id : Date.now(),
    };

    if (isEditMode) {
      setAppointments((prev) => prev.map((a) => (a.id === formData.id ? newEntry : a)));
    } else {
      setAppointments((prev) => [...prev, newEntry]);
    }

    setFormData({ id: null, title: "", description: "", date: "", time: "" });
    setIsEditMode(false);
  };

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setIsEditMode(true);
  };

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(`${a.date}T${a.time}`) >= now);
  const past = appointments.filter((a) => new Date(`${a.date}T${a.time}`) < now);

  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">Appointment</Link>
        <div className="navbar-nav ms-auto d-flex gap-3">
          <Link className="nav-link" to="/upcoming">Upcoming</Link>
          <Link className="nav-link" to="/past">Past</Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>

          {/* Home Route - Form */}
          <Route path="/" element={
            <>
              <h2 className="mb-4 text-center">Appointment Management System</h2>
              <form onSubmit={handleSubmit} className="mb-4 border p-4 rounded shadow-sm">
                <h5>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</h5>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-control" name="time" value={formData.time} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">{isEditMode ? "Update" : "Add"} Appointment</button>
              </form>
            </>
          } />

          {/* Upcoming Appointments */}
          <Route path="/upcoming" element={
            <>
              <h4>Upcoming Appointments</h4>
              {upcoming.length === 0 ? (
                <p className="text-muted">No upcoming appointments.</p>
              ) : (
                <ul className="list-group mb-4">
                  {upcoming.map((a) => (
                    <li key={a.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{a.title}</strong> — {a.description}<br />
                        <small>{a.date} at {a.time}</small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(a)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          } />

          {/* Past Appointments */}
          <Route path="/past" element={
            <>
              <h4>Past Appointments</h4>
              {past.length === 0 ? (
                <p className="text-muted">No past appointments.</p>
              ) : (
                <ul className="list-group mb-4">
                  {past.map((a) => (
                    <li key={a.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{a.title}</strong> — {a.description}<br />
                        <small>{a.date} at {a.time}</small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(a)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
