import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import KitchenHeader from "../components/kitchen/KitchenHeader";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('Hoy');

  const stats = [
    { title: "Ventas Totales", value: "$1,245.50", change: "+12.5%", trendingUp: true, icon: DollarSign },
    { title: "Órdenes", value: "84", change: "+5.2%", trendingUp: true, icon: ShoppingBag },
    { title: "Ticket Promedio", value: "$14.82", change: "-2.1%", trendingUp: false, icon: BarChart3 },
    { title: "Caja Chica", value: "$120.00", change: "Estable", trendingUp: true, icon: ArrowUpRight },
  ];

  const topProducts = [
    { name: "Zasly Burger Special", sales: 42, revenue: "$525.00" },
    { name: "Doble Queso Neón", sales: 28, revenue: "$392.00" },
    { name: "Combo Parrillero", sales: 15, revenue: "$277.50" },
    { name: "Batido Fresa Neón", sales: 12, revenue: "$54.00" },
  ];

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader 
        title="REPORTES" 
        rightMeta={<>Rango: {timeRange} · Actualizado hace 2 min</>}
      />

      <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
        <div className="flex gap-2 mb-6">
          {['Hoy', 'Semana', 'Mes', 'Año'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest transition-all ${
                timeRange === range ? 'bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20' : 'bg-[#1A1A1A] text-[#A0A0A0] hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-[#FF4500]">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                    stat.trendingUp ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {stat.trendingUp ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-[#A0A0A0] font-bold text-xs uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-3xl font-black tracking-tighter italic">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Top Productos</h3>
              <Badge className="bg-white/5 text-[#FF4500] border-none font-black">Ventas</Badge>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {topProducts.map((item, index) => (
                  <div key={index} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-[#A0A0A0]">
                        {index + 1}
                      </div>
                      <span className="font-bold text-lg">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xl italic text-[#FF4500]">{item.sales}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#A0A0A0]">{item.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl flex flex-col justify-center items-center p-12 text-center">
            <div className="w-24 h-24 bg-[#FF4500]/10 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="w-12 h-12 text-[#FF4500]" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Más gráficas próximamente</h3>
            <p className="text-[#A0A0A0] font-bold max-w-xs">Estamos preparando visualizaciones detalladas de tus horas pico e ingresos.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
