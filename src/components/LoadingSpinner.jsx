export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full py-10">
      <div className="relative w-16 h-16">
        {/* Outer Ring - thicker and brighter */}
        <div className="absolute inset-0 rounded-full border-6 border-[#a2d15f]/50 border-t-[#2d5128] animate-spin"></div>

        {/* Inner Glass Ball */}
        <div className="absolute inset-2 rounded-full backdrop-blur-md bg-[#e4eb9c]/40 shadow-lg"></div>

        {/* Center Glow - stronger */}
        <div className="absolute inset-4 bg-[#537b2f] rounded-full animate-ping opacity-60 scale-110"></div>
      </div>
    </div>
  );
}
