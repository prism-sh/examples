"use client";

import React from "react";
import Link from "next/link";

export default function CustomButton({
  cta,
  href,
}: {
  cta: string;
  href: string;
}) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <button
        className="h-[64px] p-1 rounded-full
        bg-gradient-to-r from-[#D84EF3] via-[#78C6FF] to-[#FEE517]
        hover:animate-gradient-x hover:bg-[length:300%_300%] bg-[length:100%_100%]
        hover:shadow-[0_0_30px_rgba(216,78,243,0.8)] transition-shadow duration-300"
      >
        <div className="bg-white px-[22px] py-4 rounded-full flex items-center gap-2 justify-center">
          <p className="text-black">{cta}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893L19.7071 6.29289C20.0976 6.68342 20.0976 7.31658 19.7071 7.70711L13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071C11.9024 13.3166 11.9024 12.6834 12.2929 12.2929L16.5858 8H1C0.447715 8 0 7.55228 0 7C0 6.44772 0.447715 6 1 6H16.5858L12.2929 1.70711C11.9024 1.31658 11.9024 0.683417 12.2929 0.292893Z"
              fill="black"
            />
          </svg>
        </div>
      </button>
    </Link>
  );
}
