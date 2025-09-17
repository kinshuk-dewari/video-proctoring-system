import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export const Button1:React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-[#EDEDED] text-base hover:bg-[#EDEDED]/80 text-[#010100] font-semibold rounded-lg focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};
export const Button2:React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 border-1 text-base bg-[#010100] border-[#EDEDED]/20 hover:bg-[#252525] text-[#EDEDED] font-semibold rounded-lg focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

