import { SyncLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <SyncLoader color="blue" />
    </div>
  );
};

export default LoadingSpinner;
