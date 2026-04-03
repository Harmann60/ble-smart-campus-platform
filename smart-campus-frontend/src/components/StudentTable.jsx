import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentTable({ sessionId }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/${sessionId}`
        );
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const markManual = async (student_id) => {
    await axios.post("http://localhost:5000/api/attendance/manual", {
      session_id: sessionId,
      student_id
    });
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="p-6 border-b border-campus-border bg-campus-bg/50">
        <h3 className="font-bold text-campus-text">Students</h3>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto p-4">

        {students.length === 0 ? (
          <div className="h-full flex items-center justify-center text-campus-secondary">
            No students detected yet.
          </div>
        ) : (

          <table className="w-full text-left border-collapse">

            {/* HEAD */}
            <thead>
              <tr className="text-campus-secondary text-sm border-b border-campus-border">
                <th className="py-3">ID</th>
                <th>Status</th>
                <th>Time</th>
                <th>Manual</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {students.map((s) => {

                let status = "🔴 Absent";
                if (s.is_present) status = "🟢 Present";
                else if (s.total_time_present > 0) status = "🟡 In Progress";

                return (
                  <tr
                    key={s.student_id}
                    className="border-b border-campus-border hover:bg-campus-bg transition"
                  >
                    <td className="py-3 font-bold">
                      Student {s.student_id}
                    </td>

                    <td>{status}</td>

                    <td>
                      {Math.floor(s.total_time_present / 60)} min
                    </td>

                    <td>
                      <button
                        onClick={() => markManual(s.student_id)}
                        className="bg-campus-primary text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Mark
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}