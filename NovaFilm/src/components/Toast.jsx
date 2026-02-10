/**
 * Toast — Temporary notification. Green (success) or red (error). Auto-dismiss 3s. A11y: role="alert", aria-live="polite".
 *
 * @param {string} props.message - Message text
 * @param {boolean} props.isError - If true, error (red) styling
 * @param {Function} props.onClose - Called when toast dismisses
 */
import { useEffect } from 'react';

const Toast = ({ message, isError, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg shadow-lg font-medium transition-opacity ${
        isError
          ? 'bg-red-900/90 text-red-100 border border-red-700'
          : 'bg-green-900/90 text-green-100 border border-green-700'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
