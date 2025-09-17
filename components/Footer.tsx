"use client";
import { motion } from "framer-motion"; // changed import for compatibility
import {
  IconBrandGithub,
  IconBrandX,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import Link from "next/link";


type LinkProps = {
  link: {
    href: string;
    label: string;
    desc: string;
  };
};

const Footer = () => {
  const fullstack = [
    // { href: "https://github.com/kinshuk-dewari/abode", label: "Abode", desc: "Find your perfect hostel" },
    { href: "https://sai-agro.org/", label: "Sai-agro", desc: "Website for agriculture startup" },
    { href: "https://github.com/kinshuk-dewari/My-Wallet-MERN-Stack", label: "My Wallet", desc: "Your personal e-wallet" },
    { href: "https://github.com/kinshuk-dewari/PRESENCE", label: "Presence", desc: "Attendance ERP System" },
    { href: "https://github.com/kinshuk-dewari/Bookify", label: "Bookify", desc: "Buy or lend book" },
  ];

  const others = [
    { href: "https://github.com/kinshuk-dewari/Maze", label: "Maze ", desc: "Maze generation and path finder" },
    { href: "https://github.com/kinshuk-dewari/Auto-Clicker", label: "Auto-Clicker", desc: "Script for autoclicks" },
    { href: "https://github.com/kinshuk-dewari/Space_Invader", label: "Space Invader", desc: "2D recreation of a child hood game" }, 
    { href: "https://github.com/kinshuk-dewari/GHUUNJ-Sign-Language-Detection-ML-Project", label: "Ghuunj", desc: "A sign language detection system for specially enabled" },
  ];

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto py-24">

        <div className="border-b border-[#EDEDED]/20 dark:border-neutral-700 pt-24"></div>


        <div className="grid grid-cols-4 gap-8 pt-12">
        <Link href="https://kinshuk-dewari.netlify.app/" className="text-2xl text-left font-bold text-[#E2711E] hover:text-[#E2711E]/80"> KINSHUK  </Link>

          {/* Fullstack Projects */}
          <div className="flex flex-col">
            <h3 className="font-bold text-base text-[#EDEDED] pb-2">
              Full-Stack
            </h3>
            {fullstack.map((link) => (
              <TooltipLink key={link.href} link={link} />
            ))}
          </div>

          {/* Other Projects */}
          <div className="flex flex-col">
            <h3 className="font-bold text-base text-[#EDEDED] pb-2">
              Others
            </h3>
            {others.map((link) => (
              <TooltipLink key={link.href} link={link} />
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col">
            <h3 className="font-bold text-base text-[#EDEDED] pb-4">
              Socials
            </h3>
            <div className="flex items-start justify-start gap-4">
              <motion.a
                initial={{ y: 0 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                href="https://x.com/Kinshuk_Dewari"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-700"
              >
                <IconBrandX className="h-8 w-8" />
              </motion.a>

              <motion.a
                initial={{ y: 0 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                href="https://linkedin.com/in/kinshuk-dewari"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-700"
              >
                <IconBrandLinkedin className="h-8 w-8" />
              </motion.a>

              <motion.a
                initial={{ y: 0 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                href="https://github.com/kinshuk-dewari"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-700"
              >
                <IconBrandGithub className="h-8 w-8" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function TooltipLink({ link }: LinkProps) {
    return (
      <div className="w-fit self-start pr-4 pt-2">
        <div className="relative inline-block">
          <motion.a
            initial={{ y: 0 }}
            whileHover={{ y: -1, transition: { duration: 0.2 } }}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="peer text-base text-[#888888] cursor-pointer hover:text-neutral-700"
          >
            {link.label}
          </motion.a>

          {/* Tooltip */}
          <span className="z-10 absolute capitalize left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap text-sm md:text-base bg-[#EDEDED] text-[#010100] p-2 rounded-md opacity-0 transition-opacity duration-300 peer-hover:opacity-100">
            {link.desc}
          </span>
        </div>
      </div>
    );
  }
};

export default Footer;
