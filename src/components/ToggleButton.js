import '../styles/ToggleButton.css';

function ToggleButton({ onClick, active, children }) {
  return (
    <button
      onClick={() => onClick()}
      className={`button ${active ? 'button-active' : 'button-inactive'}`}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
