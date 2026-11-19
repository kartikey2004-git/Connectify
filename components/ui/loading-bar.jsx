import { BarLoader } from "react-spinners";

/** Full-width indeterminate progress bar for page and form loading states. */
function LoadingBar({ className }) {
  return (
    <div className="loading-bar" role="progressbar" aria-label="Loading">
      <BarLoader className={className} width="100%" color="currentColor" />
    </div>
  );
}

export { LoadingBar };
