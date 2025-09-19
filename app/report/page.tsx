"use client";

import { useEffect, useState } from "react";

// Event log type
interface EventLog {
  id: string;
  type: string;
  createdAt: string;
  metadata?: any;
}

// Report type
interface ReportInfo {
  id: string;
  integrity: number;
  generatedAt: string;
  details: any;
}

// Combined session + report type
interface ReportData {
  id: string;
  roomId: string;
  candidate: {
    id: string;
    name: string;
  };
  integrity: number | null;
  events: EventLog[];
  report?: ReportInfo;
}

export default function ReportPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/reports");
        const data: ReportData[] = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <div className="text-gray-500">Loading reports...</div>;
  if (reports.length === 0)
    return <div className="text-red-500">No reports found.</div>;

  return (
    <div className="p-6 text-[#808080] space-y-8">
      <h1 className="text-3xl font-bold">All Candidate Reports</h1>

      {reports.map((session) => (
        <div
          key={session.id}
          className="border border-gray-300 rounded-lg p-4 space-y-3"
        >
          <div>
            <p>
              <span className="font-semibold">Candidate:</span>{" "}
              {session.candidate?.name || "Unknown"}
            </p>
            <p>
              <span className="font-semibold">Session ID:</span> {session.id}
            </p>
            <p>
              <span className="font-semibold">Integrity Score:</span>{" "}
              {session.report?.integrity ?? session.integrity ?? "Not calculated"}
            </p>
            <p>
              <span className="font-semibold">Total Events Detected:</span>{" "}
              {session.events?.length ?? 0}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Event Logs</h2>
            {session.events?.length === 0 ? (
              <p>No suspicious events detected 🎉</p>
            ) : (
              <ul className="space-y-2">
                {session.events.map((event) => (
                  <li
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <p>
                      <span className="font-semibold">Type:</span> {event.type}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                    {event.metadata && (
                      <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {session.report && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Report Details</h2>
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(session.report.details, null, 2)}
              </pre>
              <p className="text-sm text-gray-500 mt-1">
                Generated At:{" "}
                {new Date(session.report.generatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
