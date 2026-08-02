import { useEffect, useState } from "react";
import { connectToChangeLogEvents } from "./api/events.js";
import Header from "./components/Header";
import Content from "./components/Content";
import ChangeLogTable from "./components/ChangeLogTable";
import {
  getChangeLogs,
  type ChangeLog,
  type Pagination,
} from "./api";
import "./index.css";

const App = () => {
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [objectType, setObjectType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChangeLog, setSelectedChangeLog] =
    useState<ChangeLog | null>(null);

  const loadChangeLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getChangeLogs({
        page: pagination.page,
        pageSize: pagination.pageSize,
        objectId: search || undefined,
        objectType: objectType || undefined,
      });

      setChangeLogs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Failed to load change logs:", err);
      setError("Failed to load change logs.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const disconnect = connectToChangeLogEvents(
      (changeLog) => {
        setChangeLogs((current) => [
          changeLog as ChangeLog,
          ...current,
        ]);
      },
    );

    return disconnect;
  }, []);

  useEffect(() => {
    loadChangeLogs();
  }, [pagination.page, pagination.pageSize, search, objectType]);

  const handleSearchChange = (value: string) => {
    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setSearch(value);
  };

  const handleObjectTypeChange = (value: string) => {
    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setObjectType(value);
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <Content
          search={search}
          objectType={objectType}
          onSearchChange={handleSearchChange}
          onObjectTypeChange={handleObjectTypeChange}
        />

        {error ? (
          <div className="card">
            <div className="empty">{error}</div>
          </div>
        ) : (
          <ChangeLogTable
            changeLogs={changeLogs}
            pagination={pagination}
            loading={loading}
            onView={setSelectedChangeLog}
            onPageChange={(page) => {
              setPagination((current) => ({
                ...current,
                page,
              }));
            }}
          />
        )}
      </main>

      {selectedChangeLog && (
        <div
          className="overlay"
          onClick={() => setSelectedChangeLog(null)}
        >
          <div
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <div className="drawer-title">
                  Change Log
                </div>

                <div className="drawer-object">
                  {selectedChangeLog.objectType} ·{" "}
                  {selectedChangeLog.objectId}
                </div>
              </div>

              <button
                className="close-button"
                onClick={() => setSelectedChangeLog(null)}
              >
                ×
              </button>
            </div>

            <div className="metadata">
              <div>
                <span className="label">Operation</span>
                {selectedChangeLog.operation}
              </div>

              <div>
                <span className="label">Date</span>
                {new Date(
                  selectedChangeLog.createdAt,
                ).toLocaleString()}
              </div>

              <div>
                <span className="label">User</span>
                {selectedChangeLog.userId || "System"}
              </div>

              <div>
                <span className="label">Object ID</span>
                {selectedChangeLog.objectId}
              </div>
            </div>

            {selectedChangeLog.previousState && (
              <div className="state-section">
                <h3 className="section-title">
                  Previous State
                </h3>

                <pre className="code">
                  {JSON.stringify(
                    selectedChangeLog.previousState,
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}

            <div className="state-section">
              <h3 className="section-title">
                Current State
              </h3>

              <pre className="code">
                {JSON.stringify(
                  selectedChangeLog.currentState,
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;