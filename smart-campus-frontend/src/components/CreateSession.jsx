import { useState } from "react";
import axios from "axios";

const subjectsByBatch = {
  "2024-28": ["DSA", "DBMS", "OS"],
  "2023-27": ["CN", "TOC", "AI"]
};

const divisions = [
  "CSE A-1", "CSE A-2", "CSE A-3",
  "CSE B-1", "CSE B-2", "CSE B-3"
];

export default function CreateSession({ onSessionStart }) {

  const [batch, setBatch] = useState("");
  const [subject, setSubject] = useState("");
  const [division, setDivision] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [minTime, setMinTime] = useState(45);

  const handleStart = async () => {
    const now = new Date();

    const res = await axios.post("http://localhost:5000/api/session/start", {
      subject,
      batch,
      division,
      room_no: roomNo,
      start_time: now,
      end_time: now, // optional
      min_attendance_minutes: minTime
    });

    onSessionStart(res.data);
  };

  return (
    <div className="bg-campus-card p-8 rounded-2xl shadow border max-w-3xl">

      <h2 className="text-2xl font-bold mb-6">Start Class Session</h2>

      <div className="grid grid-cols-2 gap-6">

        {/* BATCH */}
        <div>
          <label className="text-sm text-campus-secondary">Batch</label>
          <select
            className="w-full p-3 rounded-lg bg-campus-bg border"
            onChange={(e) => {
              setBatch(e.target.value);
              setSubject("");
            }}
          >
            <option value="">Select Batch</option>
            <option value="2024-28">2024-28</option>
            <option value="2023-27">2023-27</option>
          </select>
        </div>

        {/* SUBJECT */}
        <div>
          <label className="text-sm text-campus-secondary">Subject</label>
          <select
            className="w-full p-3 rounded-lg bg-campus-bg border"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!batch}
          >
            <option value="">Select Subject</option>
            {batch &&
              subjectsByBatch[batch].map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
          </select>
        </div>

        {/* DIVISION */}
        <div>
          <label className="text-sm text-campus-secondary">Division</label>
          <select
            className="w-full p-3 rounded-lg bg-campus-bg border"
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="">Select Division</option>
            {divisions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* START TIME */}
        <div>
          <label className="text-sm text-campus-secondary">Start Time</label>
          <input
            type="time"
            className="w-full p-3 rounded-lg bg-campus-bg border"
            defaultValue={new Date().toTimeString().slice(0,5)}
          />
        </div>

        {/* ROOM NO */}
        <div>
          <label className="text-sm text-campus-secondary">Room No</label>
          <input
            type="text"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            placeholder="e.g. 104"
            className="w-full p-3 rounded-lg bg-campus-bg border"
          />
        </div>

        {/* MIN ATTENDANCE */}
        <div>
          <label className="text-sm text-campus-secondary">Min Attendance (min)</label>
          <input
            type="number"
            value={minTime}
            onChange={(e) => setMinTime(e.target.value)}
            className="w-full p-3 rounded-lg bg-campus-bg border"
          />
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={handleStart}
        className="mt-8 w-full bg-campus-primary text-white py-3 rounded-xl font-bold hover:scale-105 transition"
      >
        🚀 Start Session
      </button>
    </div>
  );
}
