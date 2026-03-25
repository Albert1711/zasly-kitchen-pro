import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { UserPlus, Plus, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import KitchenHeader from "../components/kitchen/KitchenHeader";
import { cn } from "../lib/utils";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'break' | 'offline';
}

interface StaffSection {
  id: string;
  title: string;
  members: StaffMember[];
}

export default function KitchenStaff() {
  const [sections, setSections] = useState<StaffSection[]>([
    {
      id: "1",
      title: "Meseros",
      members: [
        { id: "m1", name: "Juan Pérez", role: "Mesero Principal", status: "active" },
        { id: "m2", name: "Ana Gómez", role: "Mesera", status: "break" },
      ]
    },
    {
      id: "2",
      title: "Delivery",
      members: [
        { id: "d1", name: "Carlos Ruiz", role: "Motorizado", status: "active" },
      ]
    },
    {
      id: "3",
      title: "Ayudantes",
      members: [
        { id: "a1", name: "María García", role: "Ayudante", status: "active" },
      ]
    }
  ]);

  const addSection = () => {
    const newId = Date.now().toString();
    setSections([...sections, { id: newId, title: "Nueva Sección", members: [] }]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader 
        title="PERSONAL" 
        actions={
          <Button variant="ghost" className="h-10 px-4 rounded-xl bg-[#1A1A1A] border border-white/10 gap-2">
            <UserPlus className="w-4 h-4 text-[#FF4500]" />
            <span className="text-xs font-black uppercase tracking-widest">Agregar Personal</span>
          </Button>
        }
      />

      <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 bg-[#1A1A1A]/30 p-2 rounded-xl border border-white/5">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#FF4500] italic">
                  {section.title}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="bg-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded-md border border-white/5 text-[#A0A0A0]">
                    {section.members.length}
                  </span>
                  <button 
                    onClick={() => removeSection(section.id)}
                    className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all text-white/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {section.members.map((member) => (
                  <Card key={member.id} className="border-none bg-[#1A1A1A] rounded-xl overflow-hidden group hover:ring-1 hover:ring-[#FF4500]/40 transition-all">
                    <CardContent className="p-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center font-black text-[#FF4500] text-[10px] shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[10px] truncate leading-tight uppercase tracking-tight">{member.name}</p>
                        <p className="text-[8px] font-bold text-[#A0A0A0] uppercase tracking-widest">{member.role}</p>
                      </div>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        member.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                        member.status === 'break' ? "bg-amber-500" : "bg-white/10"
                      )} />
                      <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-3 h-3 text-[#A0A0A0]" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
                
                <button className="w-full h-10 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-[#A0A0A0] hover:text-white group">
                  <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Añadir</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Section Card */}
          <button 
            onClick={addSection}
            className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/5 rounded-[2rem] hover:bg-white/5 transition-all group min-h-[200px]"
          >
            <div className="p-4 bg-white/5 rounded-full group-hover:bg-[#FF4500]/10 transition-colors">
              <Plus className="w-8 h-8 text-[#A0A0A0] group-hover:text-[#FF4500] group-hover:rotate-90 transition-all duration-300" />
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A0A0A0] group-hover:text-white">
                AGREGAR NUEVA
              </span>
              <span className="block text-[8px] font-bold text-[#A0A0A0]/40 uppercase tracking-widest mt-1">
                SECCIÓN DE PERSONAL
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
