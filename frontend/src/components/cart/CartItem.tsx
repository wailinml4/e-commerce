import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../stores/useCartStore'
import type { CartItem as CartItemType } from '../../types'

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeFromCart, updateQuantity } = useCartStore()

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 p-5 pr-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
          <Trash2 size={120} />
      </div>

      <div className="flex flex-col sm:flex-row gap-8 relative z-10">
        {/* Product Image */}
        <Link to={`/product/${item.id}`} className="shrink-0">
          <div className="h-32 w-32 rounded-[1.5rem] bg-slate-50 overflow-hidden border border-slate-100 group-hover:shadow-lg transition-all duration-500">
            <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" src={item.images?.[0] || item.image} alt={item.name} />
          </div>
        </Link>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <Link to={`/product/${item.id}`} className="inline-flex items-center gap-2 group/link">
                <h3 className="text-xl font-bold text-slate-900 group-hover/link:text-primary transition-colors tracking-tight">{item.name}</h3>
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
              </Link>
              <p className="text-sm text-app-muted font-medium line-clamp-1 mt-1 opacity-70">Model ID: {item.id.substring(0, 8).toUpperCase()}</p>
            </div>
            
            <button
              className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeFromCart(item.id)
              }}
              title="Remove from selection"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
              <button
                className="p-2.5 rounded-lg hover:bg-white hover:text-primary transition-all disabled:opacity-30"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  updateQuantity(item.id, item.quantity - 1)
                }}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="px-5 py-1 min-w-[3rem] text-center">
                <span className="text-slate-900 font-black text-lg">{item.quantity}</span>
              </div>
              <button
                className="p-2.5 rounded-lg hover:bg-white hover:text-primary transition-all"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  updateQuantity(item.id, item.quantity + 1)
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">${(Number(item.price) * item.quantity).toFixed(2)}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-app-muted opacity-50">${Number(item.price).toFixed(2)} / unit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
