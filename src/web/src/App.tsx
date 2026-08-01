import { useState } from "react";

type ChangeLog = {
  id: string;
  objectId: string;
  objectType: string;
  operation: "CREATE" | "UPDATE" | "DELETE";
  previousState: Record<string, unknown> | null;
  currentState: Record<string, unknown> | null;
  userId: string;
  createdAt: string;
};

const mockChangeLogs: ChangeLog[] = [
  {
    id: "3",
    objectId: "order-789",
    objectType: "Order",
    operation: "DELETE",
    previousState: {
      status: "CANCELLED",
      total: 49.99,
    },
    currentState: null,
    userId: "john.smith",
    createdAt: "2026-07-31T18:45:00Z",
  },
];

function App() {
  const [selectedLog, setSelectedLog] = useState<ChangeLog | null>(null);
  const [objectType, setObjectType] = useState("");
  const [operation, setOperation] = useState("");
  const [search, setSearch] = useState("");

  const filteredLogs = mockChangeLogs.filter((log) => {
    const matchesType = !objectType || log.objectType === objectType;
    const matchesOperation = !operation || log.operation === operation;
    const matchesSearch =
      !search ||
      log.objectId.toLowerCase().includes(search.toLowerCase()) ||
      log.userId.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesOperation && matchesSearch;
  });

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>TraceVault</h1>
          <p style={styles.subtitle}>Audit & change tracking</p>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.title}>Change Logs</h2>
            <p style={styles.description}>
              Track changes made to your application objects.
            </p>
          </div>
        </div>

        <div style={styles.filters}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search object or user..."
            style={styles.input}
          />

          <select
            value={objectType}
            onChange={(event) => setObjectType(event.target.value)}
            style={styles.select}
          >
            <option value="">All objects</option>
            <option value="Order">Order</option>
          </select>

          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value)}
            style={styles.select}
          >
            <option value="">All operations</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>

        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Object</th>
                <th style={styles.th}>Operation</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}></th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={styles.td}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td style={styles.td}>
                    <div style={styles.objectType}>{log.objectType}</div>
                    <div style={styles.objectId}>{log.objectId}</div>
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.operation,
                        ...operationStyle(log.operation),
                      }}
                    >
                      {log.operation}
                    </span>
                  </td>

                  <td style={styles.td}>{log.userId}</td>

                  <td style={styles.td}>
                    <button
                      style={styles.viewButton}
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div style={styles.empty}>No change logs found.</div>
          )}
        </div>
      </main>

      {selectedLog && (
        <div
          style={styles.overlay}
          onClick={() => setSelectedLog(null)}
        >
          <aside
            style={styles.drawer}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.drawerHeader}>
              <div>
                <div style={styles.drawerTitle}>Change Details</div>
                <div style={styles.drawerObject}>
                  {selectedLog.objectType} · {selectedLog.objectId}
                </div>
              </div>

              <button
                style={styles.closeButton}
                onClick={() => setSelectedLog(null)}
              >
                ×
              </button>
            </div>

            <div style={styles.metadata}>
              <div>
                <span style={styles.label}>Operation</span>
                <strong>{selectedLog.operation}</strong>
              </div>

              <div>
                <span style={styles.label}>User</span>
                <strong>{selectedLog.userId}</strong>
              </div>

              <div>
                <span style={styles.label}>Date</span>
                <strong>
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </strong>
              </div>
            </div>

            <div style={styles.stateSection}>
              <h3 style={styles.sectionTitle}>Previous State</h3>

              <pre style={styles.code}>
                {selectedLog.previousState
                  ? JSON.stringify(selectedLog.previousState, null, 2)
                  : "null"}
              </pre>
            </div>

            <div style={styles.stateSection}>
              <h3 style={styles.sectionTitle}>Current State</h3>

              <pre style={styles.code}>
                {selectedLog.currentState
                  ? JSON.stringify(selectedLog.currentState, null, 2)
                  : "null"}
              </pre>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function operationStyle(operation: ChangeLog["operation"]) {
  switch (operation) {
    case "CREATE":
      return styles.create;

    case "UPDATE":
      return styles.update;

    case "DELETE":
      return styles.delete;
  }
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "#f5f7fa",
    color: "#172033",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  header: {
    height: 64,
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
  },

  logo: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  },

  subtitle: {
    margin: "2px 0 0",
    fontSize: 12,
    color: "#7b8496",
  },

  main: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "36px 32px",
  },

  pageHeader: {
    marginBottom: 24,
  },

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
  },

  description: {
    margin: "6px 0 0",
    color: "#6b7280",
  },

  filters: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },

  input: {
    width: 300,
    padding: "10px 12px",
    border: "1px solid #d8dde6",
    borderRadius: 8,
    background: "#ffffff",
    fontSize: 14,
  },

  select: {
    padding: "10px 32px 10px 12px",
    border: "1px solid #d8dde6",
    borderRadius: 8,
    background: "#ffffff",
    fontSize: 14,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "13px 18px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #eef0f3",
    fontSize: 14,
  },

  objectType: {
    fontWeight: 600,
  },

  objectId: {
    marginTop: 3,
    color: "#7b8496",
    fontSize: 12,
  },

  operation: {
    display: "inline-flex",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
  },

  create: {
    background: "#e8f7ee",
    color: "#18794e",
  },

  update: {
    background: "#eef4ff",
    color: "#315fba",
  },

  delete: {
    background: "#fff0f0",
    color: "#b42318",
  },

  viewButton: {
    border: "none",
    background: "transparent",
    color: "#315fba",
    cursor: "pointer",
    fontWeight: 600,
  },

  empty: {
    padding: 48,
    textAlign: "center",
    color: "#7b8496",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    justifyContent: "flex-end",
  },

  drawer: {
    width: 560,
    maxWidth: "90vw",
    height: "100%",
    background: "#ffffff",
    overflowY: "auto",
    boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.12)",
  },

  drawerHeader: {
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  drawerTitle: {
    fontSize: 18,
    fontWeight: 700,
  },

  drawerObject: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
  },

  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: 28,
    lineHeight: 1,
    cursor: "pointer",
    color: "#6b7280",
  },

  metadata: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    padding: 24,
    borderBottom: "1px solid #e5e7eb",
  },

  label: {
    display: "block",
    marginBottom: 5,
    color: "#7b8496",
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: 600,
  },

  stateSection: {
    padding: "20px 24px",
  },

  sectionTitle: {
    margin: "0 0 10px",
    fontSize: 14,
  },

  code: {
    margin: 0,
    padding: 16,
    background: "#111827",
    color: "#e5e7eb",
    borderRadius: 8,
    overflowX: "auto",
    fontSize: 12,
    lineHeight: 1.6,
  },
};

export default App;
