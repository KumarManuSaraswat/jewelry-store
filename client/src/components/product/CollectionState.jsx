export default function CollectionState({ loading, error, retry, empty }) {
  if (loading)
    return (
      <div
        className="product-grid skeleton-grid"
        aria-label="Loading collection"
        role="status"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="skeleton" />
            <div className="skeleton skeleton-line" />
          </div>
        ))}
      </div>
    );
  if (error)
    return (
      <div className="empty-state" role="alert">
        <h3>A little pause in the sparkle.</h3>
        <p>{error}</p>
        <button className="btn-secondary" onClick={retry}>
          Try again
        </button>
      </div>
    );
  if (empty)
    return (
      <div className="empty-state">
        <h3>No pieces here just yet.</h3>
        <p>Try another category or check back for our next drop.</p>
      </div>
    );
  return null;
}
