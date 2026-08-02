interface ContentProps {
  search: string;
  objectType: string;
  onSearchChange: (value: string) => void;
  onObjectTypeChange: (value: string) => void;
}

const Content = ({
  search,
  objectType,
  onSearchChange,
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
      </div>
    </div>
  );
};

export default Content;