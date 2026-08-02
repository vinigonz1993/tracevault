import type { ChangeLog, Pagination } from "../../api";
import ChangeDiff from "../ChangeDiff";

interface ChangeLogTableProps {
  changeLogs: ChangeLog[];
  pagination: Pagination;
  loading: boolean;
  onView: (changeLog: ChangeLog) => void;
  onPageChange: (page: number) => void;
}

const ChangeLogTable = ({
  changeLogs,
  pagination,
  loading,
  onView,
  onPageChange,
}: ChangeLogTableProps) => {
  if (loading) {
    return (
      <div className="card">
        <div className="empty">Loading change logs...</div>
      </div>
    );
  }

  if (changeLogs.length === 0) {
    return (
      <div className="card">
        <div className="empty">No change logs found.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th className="th">Object</th>
            <th className="th">Operation</th>
            <th className="th">User</th>
            <th className="th">Date</th>
            <th className="th">Diff</th>
            <th className="th" />
          </tr>
        </thead>

        <tbody>
          {changeLogs.map((changeLog) => (
            <tr key={changeLog.id}>
              <td className="td">
                <div className="object-type">
                  {changeLog.objectType}
                </div>

                <div className="object-id">
                  {changeLog.objectId}
                </div>
              </td>

              <td className="td">
                <span
                  className={`operation ${changeLog.operation.toLowerCase()}`}
                >
                  {changeLog.operation.toUpperCase()}
                </span>
              </td>

              <td className="td">
                {changeLog.userId || "System"}
              </td>

              <td className="td">
                {new Date(changeLog.createdAt).toLocaleString()}
              </td>

              <td className="td">
                <ChangeDiff
                  previousState={changeLog.previousState}
                  currentState={changeLog.currentState}
                  compact
                />
              </td>

              <td className="td">
                <button
                  className="view-button"
                  onClick={() => onView(changeLog)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="pagination-info">
          Showing{" "}
          {((pagination.page - 1) * pagination.pageSize) + 1}
          {" - "}
          {Math.min(
            pagination.page * pagination.pageSize,
            pagination.total,
          )}
          {" of "}
          {pagination.total}
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-button"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </button>

          <span className="pagination-page">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            className="pagination-button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeLogTable;