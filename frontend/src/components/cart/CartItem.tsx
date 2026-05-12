import { Minus, Plus, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../stores/useCartStore'
import type { CartItem as CartItemType } from '../../types'

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeFromCart, updateQuantity } = useCartStore()

  return (
    <Link to={`/product/${item.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:border-gray-300 transition-colors cursor-pointer">
        <div className="flex gap-6">
          <div className="shrink-0">
            <div className="h-24 w-24 rounded-lg bg-gray-50 overflow-hidden">
              <img className="h-full w-full object-cover" src={item.images?.[0] || ''} alt={item.name} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-gray-700 transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFromCart(item.id)
                }}
              >
                <Trash size={18} />
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-3">
                <label className="sr-only">Choose quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-300"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      updateQuantity(item.id, item.quantity - 1)
                    }}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="px-3 py-2 min-w-[3rem] text-center">
                    <span className="text-gray-900 font-medium">{item.quantity}</span>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-300"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      updateQuantity(item.id, item.quantity + 1)
                    }}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${Number(item.price).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
export default CartItem
