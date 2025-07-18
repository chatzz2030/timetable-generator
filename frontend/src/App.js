import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./index.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

function App() {
  const [form, setForm] = useState({
    workingDays: 6,
    periodsPerDay: 6,
    teachers: 20,
    sections: 5,
    periodDuration: 45,
    startTime: "08:00",
    endTime: "15:00",
    mapping: "",
    labs: "",
    sports: "",
    library: "",
    counseling: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [view, setView] = useState("section");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/generate-timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to generate timetable");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (id) => {
    const input = document.getElementById(id);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("timetable.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Timetable Generator</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700">Number of working days</label>
          <input type="number" name="workingDays" min="1" max="7" value={form.workingDays} onChange={handleChange} className="input" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Periods per day</label>
          <input type="number" name="periodsPerDay" min="1" max="10" value={form.periodsPerDay} onChange={handleChange} className="input" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Total teachers</label>
          <input type="number" name="teachers" min="1" value={form.teachers} onChange={handleChange} className="input" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Sections</label>
          <input type="number" name="sections" min="1" value={form.sections} onChange={handleChange} className="input" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Class period duration (mins)</label>
          <input type="number" name="periodDuration" min="1" value={form.periodDuration} onChange={handleChange} className="input" required />
        </div>
        <div className="mb-4 flex gap-2">
          <div>
            <label className="block text-gray-700">Start time</label>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="block text-gray-700">End time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="input" required />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Teacher-Subject-Section Mapping (JSON or CSV)</label>
          <textarea name="mapping" value={form.mapping} onChange={handleChange} className="input" rows={2} placeholder="e.g. { 'teacher1': { 'subject': 'Math', 'sections': ['A', 'B'] } }" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Labs, sports, library, counseling preferences</label>
          <textarea name="labs" value={form.labs} onChange={handleChange} className="input" rows={1} placeholder="Labs: Tue,Thu,Fri; Sports: Fri; ..." />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" disabled={loading}>
          {loading ? "Generating..." : "Generate Timetable"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      {loading && (
        <div className="flex flex-col items-center">
          <div className="loader mb-2"></div>
          <span>Generating timetable...</span>
        </div>
      )}
      {result && (
        <div className="w-full max-w-4xl mt-6">
          <div className="flex gap-4 mb-2">
            <button className={`px-4 py-2 rounded ${view === "section" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setView("section")}>Section-wise</button>
            <button className={`px-4 py-2 rounded ${view === "teacher" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setView("teacher")}>Teacher-wise</button>
            <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded" onClick={() => downloadPDF(view + "-timetable-table")}>Download as PDF</button>
          </div>
          <div id="section-timetable-table" style={{ display: view === "section" ? "block" : "none" }}>
            <h2 className="text-xl font-bold mb-2">Section-wise Timetable</h2>
            {/* Render section-wise timetable here */}
            <pre className="bg-white p-4 rounded shadow overflow-x-auto">{JSON.stringify(result.section_timetables, null, 2)}</pre>
          </div>
          <div id="teacher-timetable-table" style={{ display: view === "teacher" ? "block" : "none" }}>
            <h2 className="text-xl font-bold mb-2">Teacher-wise Timetable</h2>
            {/* Render teacher-wise timetable here */}
            <pre className="bg-white p-4 rounded shadow overflow-x-auto">{JSON.stringify(result.teacher_timetables, null, 2)}</pre>
          </div>
        </div>
      )}
      <style>{`
        .input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; margin-top: 0.25rem; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;