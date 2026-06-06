import { CheckSquare2 } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f2f8ff] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 -top-36 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -right-36 bottom-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/25">
            <CheckSquare2 size={28} />
          </div>

          <div className="absolute -inset-3 animate-spin rounded-[1.8rem] border-2 border-transparent border-t-blue-600 border-r-cyan-400" />
        </div>

        <p className="mt-7 text-base font-black tracking-tight text-slate-900">
          Loading TaskFlow
        </p>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Preparing your workspace...
        </p>

        <div className="mt-5 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />
        </div>
      </div>
    </div>
  );
}