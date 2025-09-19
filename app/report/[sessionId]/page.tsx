"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface EventLog {
  id: string;
  type: string;
  createdAt: string;
  metadata?: { message?: string; timestamp?: string; candidateName?: string };
}

interface ReportData {
  id: string;
  sessionId: string;
  candidateName: string;
  durationMinutes: number;
  focusLostCount: number;
  suspiciousEvents: EventLog[];
  integrityScore: number;
  events: EventLog[];
}

export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId as string;

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/report/load/${reportId}`);
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    }

    if (reportId) fetchReport();
  }, [reportId]);

  if (loading) return <div className="text-gray-500">Loading report...</div>;
  if (!report) return <div className="text-red-500">No report found.</div>;

  return (
    <div className="p-6 text-[#808080] space-y-6">
      <h1 className="text-3xl font-bold">Proctoring Report</h1>

      <div className="space-y-2">
        <p><span className="font-semibold">Candidate:</span> {report.candidateName}</p>
        <p><span className="font-semibold">Session ID:</span> {report.sessionId}</p>
        <p><span className="font-semibold">Interview Duration:</span> {report.durationMinutes} min</p>
        <p><span className="font-semibold">Focus Lost Count:</span> {report.focusLostCount}</p>
        <p><span className="font-semibold">Integrity Score:</span> {report.integrityScore}</p>
        <p><span className="font-semibold">Suspicious Events Detected:</span> {report.suspiciousEvents.length}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Event Logs</h2>
        {report.events.length === 0 ? (
          <p>No events detected</p>
        ) : (
          <ul className="space-y-2">
            {report.events.map((event) => (
              <li key={event.id} className="border border-gray-300 rounded-lg p-3">
                <p><span className="font-semibold">Type:</span> {event.type}</p>
                <p><span className="font-semibold">Time:</span> {new Date(event.createdAt).toLocaleString()}</p>
                {event.metadata?.message && (
                  <p><span className="font-semibold">Message:</span> {event.metadata.message}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
