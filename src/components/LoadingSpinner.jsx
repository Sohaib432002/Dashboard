export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full py-10">
      <div className="relative w-16 h-16">
        {/* Outer Ring - gradient spin */}
        <div className="absolute inset-0 rounded-full border-6 border-[#000046]/50 border-t-[#1cb5e0] animate-spin"></div>

        {/* Inner Glass Ball */}
        <div className="absolute inset-2 rounded-full backdrop-blur-md bg-gradient-to-br from-[#000046]/40 to-[#1cb5e0]/40 shadow-lg"></div>

        {/* Center Glow - gradient ping */}
        <div className="absolute inset-4 rounded-full animate-ping opacity-60 scale-110 bg-gradient-to-br from-[#000046] to-[#1cb5e0]"></div>
      </div>
    </div>
  )
}
