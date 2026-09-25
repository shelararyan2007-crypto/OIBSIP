import { useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import "../styles/toast.css";
function Toast({ message, type = "success", onClose }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);

  }, [onClose]);


  return (

    <div className={`toast ${type}`}>

      <div className="toast-content">

        <FaCheckCircle className="toast-icon" />

        <span>
          {message}
        </span>

      </div>


      <button
        className="toast-close"
        onClick={onClose}
      >
        <FaTimes />
      </button>

    </div>

  );

}

export default Toast;