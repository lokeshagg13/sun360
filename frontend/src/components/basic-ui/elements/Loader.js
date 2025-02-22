import "./Loader.css";

// Loader gif to show loading sign when a resource is being loaded
function Loader() {
  return (
    <div className="loader">
      <img src="/images/loading.gif" alt="Loading..." />
    </div>
  );
}

export default Loader;
