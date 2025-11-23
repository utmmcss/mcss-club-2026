import React from "react";

const Social = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="12" cy="5.5" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="6.2" cy="17.2" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="17.8" cy="17.2" r="2.2" fill="currentColor" stroke="none" />

        <path d="M11.1 7.1c-1.6 2.8-3 5.2-4.6 8.1" />
        <path d="M12.9 7.1c1.6 2.8 3 5.2 4.6 8.1" />

        <path d="M12 2.5a9.5 9.5 0 1 0 0 19a9.5 9.5 0 0 0 0-19z" opacity="0.06" fill="currentColor" stroke="none" />
    </svg>
);

export default Social;
