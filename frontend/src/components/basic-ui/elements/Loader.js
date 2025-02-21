import "./Loader.css";

// Loader gif to show loading sign when a resource is being loaded
function Loader() {
  return (
    <div className={classes.loader}>
      <img src="/images/spinning-loading.gif" alt="Loading..." />
    </div>
  );
}

export default Loader;
