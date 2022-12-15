import "../styles/ToggleButton.css";

function ToggleButton({ onClick, active, children }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`button ${active ? "button-active" : "button-inactive"}`}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
