export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-[6px] border-[#000046]/50 border-t-[#1cb5e0]" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#000046]/40 to-[#1cb5e0]/40 backdrop-blur-md" />
        <div className="absolute inset-4 animate-ping rounded-full bg-gradient-to-br from-[#000046] to-[#1cb5e0] opacity-60" />
      </div>
    </div>
  )
}
