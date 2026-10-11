import React from 'react';

export const PixelHeroFallback: React.FC = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#0A0910]"
      aria-hidden="true"
    >
      {/* Dusk sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181226] via-[#100D1A] to-[#0A0910]" />

      {/* Distant voxel stars */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#8E6BDB_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Layered Minecraft mountain horizon silhouettes */}
      <svg
        className="absolute bottom-0 left-0 w-full h-72 opacity-25"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        {/* Distant mountain layer */}
        <polygon
          points="0,300 0,160 80,160 80,120 160,120 160,80 240,80 240,140 320,140 400,140 400,100 480,100 480,60 560,60 640,60 640,110 720,110 800,110 800,70 880,70 960,70 960,130 1040,130 1120,130 1200,180 1200,300"
          fill="#26213B"
        />
        {/* Midground mountain layer */}
        <polygon
          points="0,300 0,210 60,210 60,180 140,180 140,150 200,150 200,200 280,200 360,200 360,170 440,170 440,130 520,130 600,130 600,170 680,170 760,170 840,170 840,140 920,140 1000,140 1080,180 1200,210 1200,300"
          fill="#1C182B"
        />
        {/* Foreground terrain layer */}
        <polygon
          points="0,300 0,250 100,250 100,220 220,220 220,260 340,260 340,230 460,230 580,230 580,250 700,250 820,250 820,220 940,220 1060,220 1200,260 1200,300"
          fill="#13101E"
        />
      </svg>

      {/* Atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8E6BDB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#3DDC84]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
