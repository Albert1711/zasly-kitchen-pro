import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChefHat, Settings, History, CheckCircle2, ArrowRight, Flame } from "lucide-react";
import { useCurrentRestaurant } from "../contexts/RestaurantContext";
import { useOrders } from "../hooks/useOrders";
import { cn } from "../lib/utils";
import KitchenHeader from "../components/kitchen/KitchenHeader";
import type { Order, OrderItem } from "../types/supabase";
import { Dialog, DialogContent } from "../components/ui/dialog";

const OrderTimer = memo(({ createdAt, onStatusChange }: { createdAt: string, onStatusChange: (status: 'normal' | 'alert' | 'urgent') => void }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(createdAt).getTime();
      const now = new Date().getTime();
      const diff = now - start;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      setMinutes(mins);
      setSeconds(secs);

      if (mins >= 15) onStatusChange('urgent');
      else if (mins >= 10) onStatusChange('alert');
      else onStatusChange('normal');
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [createdAt, onStatusChange]);

  return (
    <div className="text-2xl font-mono font-black tracking-tighter">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
});

OrderTimer.displayName = 'OrderTimer';

const OrderCard = memo(({ order, onDispatch }: { order: Order & { order_items: OrderItem[] }, onDispatch: (id: string) => void }) => {
  const [timeStatus, setTimeStatus] = useState<'normal' | 'alert' | 'urgent'>('normal');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleItem = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const orderType = order.table_name ? 'MESA' : 'LLEVAR';
  const orderTypeValue = order.table_name ? `${order.table_name}` : 'AQUÍ';

  const propina = (order as any)?.tip_amount ?? (order as any)?.tip ?? null;
  const shouldShowPropina = typeof propina === 'number' ? propina > 0 : Boolean(propina);

  const statusColor = timeStatus === 'urgent' ? "#FF0000" : timeStatus === 'alert' ? "#FFB800" : "#FF4500";

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "w-[340px] h-full bg-white flex flex-col relative cursor-pointer hover:translate-y-[-4px]",
          "rounded-none shadow-2xl",
          "border-t-[12px]",
          "animate-in slide-in-from-top-full duration-700 ease-out fill-mode-backwards",
          timeStatus === 'urgent' ? "border-[#FF0000] animate-blink-red" : 
          timeStatus === 'alert' ? "border-[#FFB800]" : "border-[#FF4500]"
        )}
        style={{ 
          boxShadow: `0 20px 50px -12px ${statusColor}40`,
        }}
      >
        {/* Ticket Header */}
        <div className="p-6 pb-2 bg-white relative border-b-2 border-dashed border-black/10">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="bg-black text-white px-3 py-1 rounded-none font-mono font-black text-lg tracking-tighter">
              #{order.order_number}
            </div>
            <div className={cn(
              "font-mono font-black text-3xl tabular-nums tracking-tighter",
              timeStatus === 'urgent' ? "text-[#FF0000]" : 
              timeStatus === 'alert' ? "text-[#FFB800]" : "text-black"
            )}>
              <OrderTimer createdAt={order.created_at} onStatusChange={setTimeStatus} />
            </div>
          </div>
          
          <div className="space-y-0 relative z-10">
            <h2 className="text-5xl font-[1000] text-black leading-none uppercase tracking-tighter">
              {orderType} <span className="text-[#FF4500]">{orderTypeValue}</span>
            </h2>
            <p className="text-black/40 font-mono font-bold text-[11px] tracking-widest uppercase mt-3">
              RECIBIDO: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Ticket Items */}
        <div className="flex-1 px-6 py-4 overflow-y-auto bg-white custom-scrollbar">
          <div className="space-y-5">
            {order.order_items?.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "relative flex items-center gap-4 transition-all duration-300",
                  checkedItems[item.id] ? "opacity-15 grayscale" : "opacity-100"
                )}
              >
                <div 
                  onClick={(e) => handleToggleItem(e, item.id)}
                  className={cn(
                    "w-8 h-8 border-4 rounded-none shrink-0 flex items-center justify-center transition-all duration-300",
                    checkedItems[item.id] ? "bg-black border-black" : "border-black bg-white"
                  )}
                >
                  {checkedItems[item.id] && <CheckCircle2 className="text-white w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-[#FF4500] font-mono leading-none">
                      {item.quantity}
                    </span>
                    <span className="text-2xl font-black text-black leading-none uppercase tracking-tighter truncate">
                      {(item as any).product_name ?? (item as any).name ?? (item as any).title ?? "ITEM"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {order.order_items?.length > 6 && (
              <div className="text-black/40 font-black text-xs uppercase text-center py-3 border-y border-dashed border-black/10 font-mono">
                -- VER {order.order_items.length - 6} MÁS --
              </div>
            )}
          </div>
        </div>

        {/* Ticket Footer / Dispatch */}
        <div className="p-6 bg-white border-t-2 border-dashed border-black/10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDispatch(order.id);
            }}
            className={cn(
              "h-20 w-full rounded-none text-3xl font-[1000] uppercase tracking-tighter transition-all active:scale-95 shadow-xl",
              timeStatus === 'urgent' ? "bg-[#FF0000] text-white" : 
              timeStatus === 'alert' ? "bg-[#FFB800] text-black" : "bg-black text-white"
            )}
          >
            DESPACHAR
          </button>
        </div>

        {/* Physical Paper Effect Bottom */}
        <div className="h-4 w-full flex overflow-hidden bg-transparent pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-white rotate-45 -translate-y-3 shrink-0 border-r border-b border-black/5 shadow-sm" />
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white border-none rounded-none p-0 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="p-8 border-b-4 border-dashed border-black/10 bg-black text-white rounded-none">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="text-[#FF4500] font-mono font-black tracking-widest text-sm uppercase">Detalles de Orden</span>
                <h2 className="text-5xl font-black leading-none tracking-tighter uppercase">
                  {orderType} {orderTypeValue}
                </h2>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-none font-mono font-black text-2xl">
                #{order.order_number}
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-none font-mono text-sm font-bold">
                RECIBIDO: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className={cn(
                "px-4 py-2 rounded-none font-mono text-sm font-black",
                timeStatus === 'urgent' ? "bg-[#FF0000] text-white" : 
                timeStatus === 'alert' ? "bg-[#FFB800] text-black" : "bg-white/10 text-white"
              )}>
                TIEMPO: {Math.floor((new Date().getTime() - new Date(order.created_at).getTime()) / 60000)} MIN
              </div>
            </div>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
            <div className="space-y-6">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-start gap-6 pb-6 border-b border-black/5 last:border-0">
                  <div className="text-5xl font-black text-[#FF4500] font-mono leading-none pt-1">
                    {item.quantity}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-3xl font-black text-black leading-none uppercase tracking-tight">
                      {(item as any).product_name ?? (item as any).name ?? (item as any).title ?? "ITEM"}
                    </h3>
                    
                    {(() => {
                      const raw = (item as any).modifiers;
                      const mods = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",").filter(Boolean) : [];
                      if (mods.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-2">
                          {mods.map((mod: string, idx: number) => (
                            <span key={idx} className="bg-black text-white px-3 py-1 text-xs font-black uppercase rounded-none">
                              {mod.trim()}
                            </span>
                          ))}
                        </div>
                      );
                    })()}

                    {item.notes && (
                      <div className="p-3 bg-black/[0.03] border-l-4 border-[#FF4500] font-mono text-sm font-bold text-black italic">
                        * {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(order.notes || shouldShowPropina) && (
              <div className="mt-8 p-6 bg-black/[0.03] rounded-none border-2 border-dashed border-black/10 space-y-4">
                {order.notes && (
                  <div>
                    <span className="font-mono text-xs font-black uppercase text-black/40 block mb-1">Nota de la Orden:</span>
                    <p className="text-lg font-bold text-black uppercase tracking-tight leading-tight">{order.notes}</p>
                  </div>
                )}
                {shouldShowPropina && (
                  <div className="flex justify-between items-center pt-2 border-t border-black/5">
                    <span className="font-mono text-xs font-black uppercase text-[#FF4500]">Propina:</span>
                    <span className="text-3xl font-black text-black">${String(propina)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 bg-black">
            <Button 
              onClick={() => {
                onDispatch(order.id);
                setIsModalOpen(false);
              }}
              className="w-full h-20 text-3xl font-black uppercase tracking-tighter bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-none"
            >
              DESPACHAR AHORA
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

OrderCard.displayName = 'OrderCard';

export default function KitchenOrders() {
  const { restaurant } = useCurrentRestaurant();

  const audioRef = useRef<AudioContext | null>(null);
  const bellCooldownRef = useRef<number>(0);

  const ensureAudio = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AudioCtx) return;
    if (!audioRef.current) audioRef.current = new AudioCtx();
    if (audioRef.current.state === 'suspended') {
      await audioRef.current.resume();
    }
  }, []);

  const playBell = useCallback(async () => {
    const now = Date.now();
    if (now - bellCooldownRef.current < 1500) return;
    bellCooldownRef.current = now;

    await ensureAudio();
    const ctx = audioRef.current;
    if (!ctx) return;

    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(880, ctx.currentTime);
    o1.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    g1.gain.setValueAtTime(0.0001, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    g1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o1.connect(g1);
    g1.connect(ctx.destination);
    o1.start();
    o1.stop(ctx.currentTime + 0.38);
  }, [ensureAudio]);

  const { orders, loading, error, updateOrderStatus } = useOrders(restaurant?.id || '', {
    onNewOrder: () => {
      void playBell();
    },
  });

  const handleDispatch = useCallback(async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'listo');
    } catch (err) {
      console.error('Error dispatching order:', err);
    }
  }, [updateOrderStatus]);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#FF4500] border-t-transparent rounded-full animate-spin" />
      <span className="text-xl font-black uppercase tracking-widest text-[#FF4500]">Cargando KDS...</span>
    </div>
  );

  if (error) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-black uppercase mb-2">Error de Conexión</h2>
      <p className="text-[#A0A0A0] max-w-md">{error}</p>
    </div>
  );

  return (
    <div
      className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none"
      onPointerDown={() => {
        void ensureAudio();
      }}
      onKeyDown={() => {
        void ensureAudio();
      }}
      tabIndex={-1}
    >
      <KitchenHeader
        title="KDS"
        rightMeta={<>Órdenes activas: {orders.length}{restaurant?.id ? ` · Rest: ${restaurant.id.slice(0, 8)}…` : ""}</>}
        actions={
          <>
            <Button variant="ghost" className="h-10 w-10 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] border border-white/10 p-0">
              <History className="w-5 h-5 text-[#A0A0A0]" />
            </Button>
            <Button variant="ghost" className="h-10 w-10 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] border border-white/10 p-0">
              <Settings className="w-5 h-5 text-[#A0A0A0]" />
            </Button>
          </>
        }
      />

      <main className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden bg-[#000000] p-4 custom-scrollbar">
        <div className="h-full flex gap-4 min-w-max">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onDispatch={handleDispatch} />
          ))}
          
          {orders.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-[#333333] italic">
              <ChefHat className="w-48 h-48 mb-4 opacity-10" />
              <span className="text-4xl font-black uppercase tracking-widest opacity-20">Cocina Despejada</span>
              <span className="mt-2 text-xs font-black uppercase tracking-widest opacity-20">Si esperas pedidos y no aparece nada, revisa RLS/permisos en Supabase</span>
            </div>
          )}
        </div>
      </main>

      {orders.length > 4 && (
        <div className="h-12 bg-black flex items-center justify-center gap-4 text-[#A0A0A0] font-black uppercase tracking-[0.3em] text-sm border-t border-white/5 animate-pulse">
          <span>Desliza para ver más órdenes</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}



