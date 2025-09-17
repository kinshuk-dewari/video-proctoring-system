const SVGBackground = () => (
   <svg
      className="absolute inset-0 -z-10 h-full w-full stroke-white/18 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="100"
          height="100"
          x="50%"
          y="0"
          patternUnits="userSpaceOnUse"
        >
          <path d="M50 0V100M0 50H100" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
);

export default SVGBackground;
