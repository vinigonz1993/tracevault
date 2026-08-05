interface ContentProps {
  search: string;
  objectType: string;
  onSearchChange: (value: string) => void;
  objectTypes: string[];
  onObjectTypeChange: (value: string) => void;
}

const Content = ({
  search,
  objectType,
  onSearchChange,
  objectTypes,
  onObjectTypeChange,
}: ContentProps) => {
  return (
    <div className="page-header">
      <h2 className="title">Change Logs</h2>

      <p className="description">
        Review changes made to orders and other tracked objects.
      </p>

      <div className="filters">
        <input
          className="input"
          type="text"
          placeholder="Search by object ID..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select
          className="select"
          value={objectType}
          onChange={(event) => onObjectTypeChange(event.target.value)}
        >
          <option value="">All Object Types</option>
          {objectTypes.length > 0 && objectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Content;