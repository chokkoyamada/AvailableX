'use client';

import React, { ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
}

export function IconButton({ onClick, ariaLabel, children }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 hover:bg-white hover:bg-opacity-10 transition-colors duration-150"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
