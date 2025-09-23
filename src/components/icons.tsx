import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M12 2L6.5 5.5V18.5L12 22L17.5 18.5V5.5L12 2Z" />
        <path d="M12 2V22" />
        <path d="M17.5 5.5L6.5 13.5" />
        <path d="M6.5 5.5L17.5 13.5" />
        <path d="M6.5 10.5L12 14L17.5 10.5" />
    </svg>
  ),
};
