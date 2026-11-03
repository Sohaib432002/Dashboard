export default function Loader() {
  return (
    <div className="flex h-full min-h-[160px] w-full items-center justify-center py-10" role="status" aria-label="Loading">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-sky-500/20 border-t-[#22b8ff]" />
        <div className="absolute inset-3 animate-pulse rounded-full bg-[#22b8ff]/30 shadow-[0_0_20px_#22b8ff]" />
      </div>
    </div>
  )
}
