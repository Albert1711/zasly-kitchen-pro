import { useState } from "react";
import { Button } from "./components/ui/button";
import { ChefHat, ArrowRight, Monitor, Database, ShieldCheck, Lock, Mail, Loader2 } from "lucide-react";
import { Input } from "./components/ui/input";
import { supabase } from "./lib/supabase";

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      title: "Acceso Seguro",
      subtitle: "Inicia Sesión",
      description: "Ingresa tus credenciales para acceder al panel de control de tu restaurante.",
      icon: <Lock className="w-16 h-16" />,
      image: "https://images.unsplash.com/photo-1555392858-453df26f5d22?q=80&w=2070&auto=format&fit=crop",
      isLogin: true
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      localStorage.setItem("kitchen_onboarding_complete", "true");
      onComplete();
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex overflow-hidden font-sans">
      {/* Lado Izquierdo: Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={steps[step].image} 
          alt="Kitchen background" 
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isAnimating ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 canva-gradient opacity-60 z-20" />
        
        <div className="relative z-30 p-16 flex flex-col justify-end h-full text-white">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6">
            <ChefHat className="w-8 h-8" />
          </div>
          <h2 className="text-5xl font-black mb-4 leading-tight">Zasly Kitchen Pro</h2>
          <p className="text-xl text-white/80 max-w-md font-medium">
            La herramienta definitiva para cocinas de alto rendimiento.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Contenido/Pasos */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 relative bg-slate-50">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-slate-200'}`} 
            />
          ))}
        </div>

        <div className={`flex-1 flex flex-col justify-center transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 w-fit mb-10 text-primary animate-bounce">
            {steps[step].icon}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-primary font-bold tracking-widest uppercase text-sm">{steps[step].subtitle}</h3>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">{steps[step].title}</h2>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed pt-4">
              {steps[step].description}
            </p>
          </div>

          {(steps[step] as any).isLogin && (
            <form onSubmit={handleLogin} className="mt-8 space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary bg-white text-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary bg-white text-lg"
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                  {error}
                </p>
              )}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Entrar al Sistema"}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-12">
          <div className="text-slate-400 font-bold">
            0{step + 1} <span className="mx-2">/</span> 0{steps.length}
          </div>
          
          {!(steps[step] as any).isLogin && (
            <Button 
              onClick={nextStep}
              className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all group"
            >
              {step === steps.length - 2 ? "Finalizar y entrar" : "Siguiente paso"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>

        {/* Marca de agua sutil */}
        <div className="absolute bottom-8 left-8 lg:left-24 text-[10px] uppercase tracking-[0.2em] font-black text-slate-300">
          Zasly Pro &copy; 2026
        </div>
      </div>
    </div>
  );
}
