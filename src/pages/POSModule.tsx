import { useState, useMemo } from "react";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Globe, 
  Plus, 
  Minus, 
  Calculator, 
  History, 
  Settings, 
  Lock, 
  Unlock,
  Zap,
  RefreshCw,
  X,
  Check
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import KitchenHeader from "../components/kitchen/KitchenHeader";

// Tipos
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  modifiers?: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedModifiers?: string[];
}

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '🍽️' },
  { id: 'hamburguesas', name: 'Burgers', icon: '🍔' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'combos', name: 'Combos', icon: '🍟' },
  { id: 'promos', name: 'Promos', icon: '🏷️' },
];

const PRODUCTS: Product[] = [
  { id: '1', name: 'Zasly Burger Special', price: 12.50, category: 'hamburguesas', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop', modifiers: ['Sin Cebolla', 'Extra Queso', 'Término Medio'] },
  { id: '2', name: 'Doble Queso Neón', price: 14.00, category: 'hamburguesas', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=200&auto=format&fit=crop', modifiers: ['Extra Bacon', 'Sin Salsas'] },
  { id: '3', name: 'Coca-Cola 500ml', price: 2.50, category: 'bebidas', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop' },
  { id: '4', name: 'Combo Parrillero', price: 18.50, category: 'combos', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop' },
  { id: '5', name: 'Nuggets Box (12)', price: 9.00, category: 'promos', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=200&auto=format&fit=crop' },
  { id: '6', name: 'Batido Fresa Neón', price: 4.50, category: 'bebidas', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200&auto=format&fit=crop' },
];

export default function POSModule() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount] = useState(0);
  const [isCajaAbierta, setIsCajaAbierta] = useState(true);
  const [tip, setTip] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(36.50);
  const [isRefreshingRate, setIsRefreshingRate] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [selectedProductForModifiers, setSelectedProductForModifiers] = useState<Product | null>(null);
  const [tempModifiers, setTempModifiers] = useState<string[]>([]);

  const refreshExchangeRate = () => {
    setIsRefreshingRate(true);
    setTimeout(() => {
      setExchangeRate(prev => prev + (Math.random() * 0.5 - 0.25));
      setIsRefreshingRate(false);
    }, 800);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      (activeCategory === 'all' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCategory, searchTerm]);

  const addToCart = (product: Product, selectedModifiers: string[] = []) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedModifiers) === JSON.stringify(selectedModifiers)
      );
      
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...product, quantity: 1, selectedModifiers }];
    });
    setSelectedProductForModifiers(null);
    setTempModifiers([]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleProductClick = (product: Product) => {
    if (product.modifiers && product.modifiers.length > 0) {
      setSelectedProductForModifiers(product);
      setTempModifiers([]);
    } else {
      addToCart(product);
    }
  };

  const toggleModifier = (mod: string) => {
    setTempModifiers(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.16;
  const total = subtotal - discountAmount + tax + tip;
  const totalBs = total * exchangeRate;

  const changeDue = amountReceived ? (parseFloat(amountReceived) - total) : 0;

  return (
    <div className="h-full w-full bg-[#000000] text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* Modifiers Modal */}
      {selectedProductForModifiers && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Modificadores</h3>
                <p className="text-[#A0A0A0] text-xs font-bold">{selectedProductForModifiers.name}</p>
              </div>
              <button onClick={() => setSelectedProductForModifiers(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-6 h-6 text-[#A0A0A0]" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3">
              {selectedProductForModifiers.modifiers?.map(mod => (
                <button
                  key={mod}
                  onClick={() => toggleModifier(mod)}
                  className={cn(
                    "h-14 px-4 rounded-2xl border-2 flex items-center justify-between font-bold text-sm transition-all",
                    tempModifiers.includes(mod)
                      ? "border-[#FF4500] bg-[#FF4500]/10 text-white"
                      : "border-white/5 bg-white/5 text-[#A0A0A0] hover:border-white/20"
                  )}
                >
                  {mod}
                  {tempModifiers.includes(mod) && <Check className="w-4 h-4 text-[#FF4500]" />}
                </button>
              ))}
            </div>
            <div className="p-6 bg-black/20">
              <button
                onClick={() => addToCart(selectedProductForModifiers, tempModifiers)}
                className="w-full h-14 bg-[#FF4500] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#FF4500]/20"
              >
                Confirmar y Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      <KitchenHeader
        title="POS"
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Buscar plato (Escribe para filtrar...)",
          icon: <Search className="w-5 h-5" />,
        }}
        rightMeta={
          <div className="flex items-center gap-2">
            <span>Tasa BCV: {exchangeRate.toFixed(2)} Bs</span>
            <button 
              onClick={refreshExchangeRate}
              className={cn(
                "p-1 hover:bg-white/10 rounded-md transition-all",
                isRefreshingRate && "animate-spin"
              )}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        }
        actions={
          <>
            <Button variant="ghost" className="h-10 w-10 rounded-xl bg-[#1A1A1A] border border-white/10 p-0">
              <History className="w-5 h-5 text-[#A0A0A0]" />
            </Button>
            <Button variant="ghost" className="h-10 w-10 rounded-xl bg-[#1A1A1A] border border-white/10 p-0">
              <Settings className="w-5 h-5 text-[#A0A0A0]" />
            </Button>
          </>
        }
      />

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Panel Izquierdo: Categorías */}
        <aside className="w-20 bg-black border-r border-white/10 flex flex-col items-center py-4 gap-3 shrink-0 overflow-y-auto custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 active:scale-90",
                activeCategory === cat.id 
                  ? "bg-[#FF4500] text-white shadow-[0_0_15px_rgba(255,69,0,0.3)]" 
                  : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#222]"
              )}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter">{cat.name}</span>
            </button>
          ))}
        </aside>

        {/* Panel Central: Catálogo */}
        <main className="flex-1 min-w-0 bg-[#050505] p-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <Card 
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group border-none bg-[#1A1A1A] rounded-[1.25rem] overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FF4500] transition-all duration-300 active:scale-95 shadow-xl"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-40" />
                  <div className="absolute bottom-3 right-3 bg-[#FF4500] px-2 py-0.5 rounded-lg text-sm font-black italic shadow-lg">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm font-black leading-tight line-clamp-2">{product.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        {/* Panel Derecho: Carrito */}
        <aside className="w-[360px] bg-[#0A0A1A] border-l border-white/10 flex flex-col shrink-0 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.3)] min-h-0">
          {/* Cart Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#FF4500]" />
              <h2 className="text-xl font-black uppercase tracking-tight">Orden #1452</h2>
            </div>
            <Badge className="bg-[#1A1A1A] text-[#FF4500] border-none text-sm font-black px-3 py-0.5 rounded-lg">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
            </Badge>
          </div>

          {/* Cart Items */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-5">
                <ShoppingCart className="w-20 h-20 mb-2" />
                <span className="text-lg font-black uppercase tracking-widest text-center">Vacío</span>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-[#1A1A1A] p-3 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-[#FF4500] font-bold text-xs">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl">
                      <button onClick={() => updateQuantity(index, -1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#333] text-[#A0A0A0] transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#333] text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1 px-1">
                      {item.selectedModifiers.map(mod => (
                        <span key={mod} className="text-[9px] font-black uppercase tracking-tighter bg-white/5 text-[#A0A0A0] px-2 py-0.5 rounded-md border border-white/5 italic">
                          + {mod}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Checkout Panel */}
          <div className="p-4 bg-[#000000] border-t border-white/10 space-y-4 shrink-0">
            {/* Payment Methods */}
            <div className="grid grid-cols-4 gap-2">
              <button className="flex flex-col items-center justify-center gap-1 p-2 bg-[#1A1A1A] rounded-xl hover:bg-[#FF4500]/10 hover:ring-1 hover:ring-[#FF4500] transition-all group active:scale-90">
                <Smartphone className="w-5 h-5 text-[#A0A0A0] group-hover:text-[#FF4500]" />
                <span className="text-[7px] font-black uppercase tracking-widest opacity-50">P. Móvil</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1 p-2 bg-[#1A1A1A] rounded-xl hover:bg-[#FF4500]/10 hover:ring-1 hover:ring-[#FF4500] transition-all group active:scale-90">
                <Banknote className="w-5 h-5 text-[#A0A0A0] group-hover:text-[#FF4500]" />
                <span className="text-[7px] font-black uppercase tracking-widest opacity-50">Efectivo</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1 p-2 bg-[#1A1A1A] rounded-xl hover:bg-[#FF4500]/10 hover:ring-1 hover:ring-[#FF4500] transition-all group active:scale-90">
                <Globe className="w-5 h-5 text-[#A0A0A0] group-hover:text-[#FF4500]" />
                <span className="text-[7px] font-black uppercase tracking-widest opacity-50">Zelle</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1 p-2 bg-[#1A1A1A] rounded-xl hover:bg-[#FF4500]/10 hover:ring-1 hover:ring-[#FF4500] transition-all group active:scale-90">
                <CreditCard className="w-5 h-5 text-[#A0A0A0] group-hover:text-[#FF4500]" />
                <span className="text-[7px] font-black uppercase tracking-widest opacity-50">Punto</span>
              </button>
            </div>

            {/* Change Calculator */}
            <div className="bg-[#1A1A1A] p-3 rounded-2xl flex items-center gap-3 border border-white/5">
              <div className="p-2 bg-[#FF4500]/10 rounded-xl text-[#FF4500]">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[8px] font-black text-[#A0A0A0] uppercase tracking-widest mb-0.5">Monto Recibido ($)</p>
                <input 
                  type="number" 
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-xl font-black outline-none w-full placeholder:text-[#333]"
                />
              </div>
              {changeDue > 0 && (
                <div className="text-right border-l border-white/10 pl-3">
                  <p className="text-[8px] font-black text-[#FFD700] uppercase tracking-widest">Cambio</p>
                  <p className="text-lg font-black text-white leading-none">${changeDue.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Tip Selection */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15].map(percent => (
                <button
                  key={percent}
                  onClick={() => setTip(subtotal * (percent / 100))}
                  className={cn(
                    "py-1.5 rounded-lg border border-white/10 text-[10px] font-black uppercase transition-all",
                    tip === (subtotal * (percent / 100)) && subtotal > 0
                      ? "bg-[#FF4500] text-white border-transparent"
                      : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-white/5"
                  )}
                >
                  +{percent}%
                </button>
              ))}
              <button
                onClick={() => setTip(0)}
                className="py-1.5 rounded-lg border border-white/10 text-[10px] font-black uppercase bg-[#1A1A1A] text-[#A0A0A0] hover:bg-white/5"
              >
                Limpiar
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#A0A0A0] font-bold text-xs">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between text-[#FF4500] font-bold text-xs">
                  <span>Propina</span>
                  <span>+${tip.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-red-500 font-bold text-xs">
                  <span>Descuento ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2 border-t border-white/10 mt-1">
                <div>
                  <p className="text-[8px] font-black text-[#FF4500] uppercase tracking-widest">Total a Pagar</p>
                  <p className="text-3xl font-black tracking-tighter">${total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white/40 leading-none">{totalBs.toLocaleString()} Bs</p>
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <button className={cn(
              "w-full h-16 rounded-2xl text-xl font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3",
              cart.length > 0 
                ? "bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20 animate-pulse" 
                : "bg-[#1A1A1A] text-[#333333] cursor-not-allowed"
            )}>
              <Zap className={cn("w-6 h-6", cart.length > 0 ? "fill-white" : "fill-[#333]")} />
              COBRAR
            </button>
          </div>

          {/* POS Footer */}
          <div className="h-12 bg-[#000000] border-t border-white/10 flex items-center px-4 gap-4 shrink-0">
            <button 
              onClick={() => setIsCajaAbierta(!isCajaAbierta)}
              className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors"
            >
              {isCajaAbierta ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-red-500" />}
              <span className="text-[8px] font-black uppercase tracking-widest">Caja</span>
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors">
              <History className="w-3.5 h-3.5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Turno</span>
            </button>
            <div className="ml-auto flex items-center gap-2 text-[#FF4500]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-ping" />
              <span className="text-[8px] font-black uppercase tracking-widest">Online</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
