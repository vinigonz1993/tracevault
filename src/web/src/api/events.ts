const API_URL = "http://localhost:3000";

export const connectToChangeLogEvents = (
  onCreated: (changeLog: unknown) => void,
) => {
  const events = new EventSource(
    `${API_URL}/change-logs/events`,
  );

  events.addEventListener("change-log-created", (event) => {
    const changeLog = JSON.parse(event.data);

    onCreated(changeLog);
  });

  events.onerror = (error) => {
    console.error("SSE connection error:", error);
  };

  return () => {
    events.close();
  };
};