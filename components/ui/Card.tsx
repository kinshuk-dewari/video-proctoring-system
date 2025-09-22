import React from "react";
import Image from "next/image";

type CardProps = {
  imageSrc: string;
  title: string;
  desc: string;
};

const Card: React.FC<CardProps> = ({ imageSrc, title, desc }) => {
  return (
    <div className="relative hover:cursor-pointer text-left rounded-lg shadow-lg overflow-hidden border border-[#EDEDED]/20 bg-[#010100] p-6 flex flex-col group">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#010100] from-50% to-[#252525] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>
      
      <div className="relative w-full h-42 mb-4">
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: "cover", borderRadius: "0.5rem" }}
        />
      </div>

      <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
      <p className="text-[#888888] text-pretty text-sm relative z-10">{desc}</p>
    </div>
  );
};

export default Card;
