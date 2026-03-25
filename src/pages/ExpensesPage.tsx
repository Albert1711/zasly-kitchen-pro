import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowUpRight, Plus, Calendar, DollarSign, Tag, Trash2 } from "lucide-react";
import KitchenHeader from "../components/kitchen/KitchenHeader";
import { Button } from "../components/ui/button";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  time: string;
}

export default function ExpensesPage() {
  const [expenses] = useState<Expense[]>([
    { id: '1', description: 'Compra de Hielo (3 sacos)', amount: 15.00, category: 'Suministros', time: '10:30 AM' },
    { id: '2', description: 'Pago Motorizado Delivery', amount: 5.00, category: 'Logística', time: '11:15 AM' },
    { id: '3', description: 'Reparación de Licuadora', amount: 45.00, category: 'Mantenimiento', time: '01:45 PM' },
  ]);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader 
        title="GASTOS" 
        rightMeta={<>Total Gastos Hoy: ${totalExpenses.toFixed(2)}</>}
        actions={
          <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-black rounded-xl h-10 px-4">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Gasto
          </Button>
        }
      />

      <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl text-[#FF4500]">
                  <DollarSign className="w-6 h-6" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black uppercase tracking-widest text-[8px]">En Caja</Badge>
              </div>
              <p className="text-[#A0A0A0] font-bold text-xs uppercase tracking-widest mb-1">Efectivo Disponible</p>
              <p className="text-3xl font-black tracking-tighter italic">$120.00</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl text-red-500">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <Badge className="bg-red-500/10 text-red-400 border-none font-black uppercase tracking-widest text-[8px]">Hoy</Badge>
              </div>
              <p className="text-[#A0A0A0] font-bold text-xs uppercase tracking-widest mb-1">Total Egresos</p>
              <p className="text-3xl font-black tracking-tighter italic">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl text-sky-500">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <p className="text-[#A0A0A0] font-bold text-xs uppercase tracking-widest mb-1">Último Cierre</p>
              <p className="text-3xl font-black tracking-tighter italic">Ayer 11:00 PM</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-black uppercase tracking-tight italic mb-4">Movimientos del Día</h3>
          {expenses.map((expense) => (
            <Card key={expense.id} className="border-none bg-[#1A1A1A] rounded-2xl shadow-xl overflow-hidden group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-red-400">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-white text-lg leading-tight">{expense.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[#A0A0A0] font-bold text-[10px] uppercase tracking-widest">
                        <Tag className="w-3 h-3" />
                        {expense.category}
                      </span>
                      <span className="text-white/20 font-black text-[10px]">·</span>
                      <span className="text-[#A0A0A0] font-bold text-[10px] uppercase tracking-widest">{expense.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-2xl font-black text-white italic">-${expense.amount.toFixed(2)}</p>
                  <button className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
