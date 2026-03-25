import { ReactNode, useEffect, useMemo, useState } from "react";
import { ChefHat } from "lucide-react";

export default function KitchenHeader({
  title,
  search,
  rightMeta,
  actions,
}: {
  title: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: ReactNode;
  };
  rightMeta?: ReactNode;
  actions?: ReactNode;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeText = useMemo(
    () => currentTime.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }),
    [currentTime]
  );

  return (
    <header className="h-16 bg-black border-b border-white/10 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-12 h-12 flex items-center justify-center mr-1">
          <img src="./logo%20zasly%20inco.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-[#FF4500] font-black text-3xl tracking-tighter italic">
          ZASLY <span className="text-white not-italic font-bold text-lg ml-1 tracking-widest uppercase opacity-50">{title}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 max-w-xl mx-8">
        {search ? (
          <div className="relative group">
            {search.icon ? (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0] group-focus-within:text-[#FF4500] transition-colors">
                {search.icon}
              </div>
            ) : null}
            <input
              type="text"
              placeholder={search.placeholder || "Buscar..."}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="w-full h-11 bg-[#1A1A1A] border-2 border-transparent focus:border-[#FF4500] rounded-xl pl-12 pr-4 text-lg font-bold placeholder:text-[#333333] outline-none transition-all"
            />
          </div>
        ) : (
          <div className="h-11" />
        )}
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right">
          <div className="text-2xl font-mono font-black tracking-tighter leading-none">{timeText}</div>
          {rightMeta ? (
            <div className="text-[#FF4500] text-[9px] font-black uppercase tracking-[0.1em]">{rightMeta}</div>
          ) : (
            <div className="text-[#A0A0A0] text-[9px] font-black uppercase tracking-[0.1em]">Zasly Kitchen Pro</div>
          )}
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
