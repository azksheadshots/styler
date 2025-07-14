export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <g transform="rotate(15 50 50)">
        <path
          d="M30,90 C30,90 20,40 50,20 C80,40 70,90 70,90"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </g>
    </svg>
  );
}
