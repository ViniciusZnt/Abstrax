const LockClosedIcon = ({ className = "h-4 w-4", strokeWidth = 2 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 10V7a4 4 0 10-8 0v3M5 10h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"
    />
  </svg>
);

const LockOpenIcon = ({ className = "h-4 w-4", strokeWidth = 2 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m6-7H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2zm-2-4V5a4 4 0 00-8 0"
    />
  </svg>
);

export { LockClosedIcon, LockOpenIcon };
