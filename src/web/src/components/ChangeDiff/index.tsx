import * as jsondiffpatch from "jsondiffpatch";

interface ChangeDiffProps {
  previousState: unknown;
  currentState: unknown;
  compact?: boolean;
}

const countChanges = (delta: unknown): number => {
  if (!delta || typeof delta !== "object") {
    return 1;
  }

  if (Array.isArray(delta)) {
    return 1;
  }

  return Object.values(delta).reduce(
    (count, value) => count + countChanges(value),
    0,
  );
};

const ChangeDiff = ({
  previousState,
  currentState,
  compact = false,
}: ChangeDiffProps) => {
  if (!previousState) {
    return (
      <span className={compact ? "diff-summary" : "diff-empty"}>
        Created
      </span>
    );
  }

  const delta = jsondiffpatch.diff(
    previousState,
    currentState,
  );

  if (!delta) {
    return (
      <span className={compact ? "diff-summary" : "diff-empty"}>
        No changes
      </span>
    );
  }

  if (compact) {
    const changes = countChanges(delta);

    return (
      <span className="diff-summary">
        {changes} {changes === 1 ? "change" : "changes"}
      </span>
    );
  }

  return (
    <div className="diff">
      <pre className="diff-code">
        {JSON.stringify(delta, null, 2)}
      </pre>
    </div>
  );
};

export default ChangeDiff;