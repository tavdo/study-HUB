function IconAddButton({ onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl sh-accent-btn shadow-lg transition-all active:scale-90 hover:brightness-110 shrink-0 ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}

export default IconAddButton;
