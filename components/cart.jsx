import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X, Edit2 } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import CustomizeDialog from "./CustomizeDialog"

export default function Cart({ cart, menu, updateCart }) {
  const [isOpen, setIsOpen] = useState(false)

  const cartItems = Object.entries(cart)
    .map(([dishId, item]) => {
      const dish = menu.find((d) => d.dishId === dishId)
      return { ...dish, ...item }
    })
    .filter((item) => item && item.quantity > 0)

  const total = cartItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 z-50">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Ver Carrito ({cartItems.length})
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Tu Pedido</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            {cartItems.length === 0 ? (
              <p>Tu carrito está vacío</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.dishId} className="flex justify-between items-start mb-4 border-b pb-2">
                    <div>
                      <span className="font-semibold">
                        {item.name} x {item.quantity}
                      </span>
                      <p className="text-sm text-gray-600">
                        ${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                      {item.observation && <p className="text-xs text-gray-500 mt-1">Nota: {item.observation}</p>}
                    </div>
                    {item.customizable && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <CustomizeDialog dish={item} cartItem={cart[item.dishId]} updateCart={updateCart} />
                      </Dialog>
                    )}
                  </div>
                ))}
                <div className="font-bold text-xl mt-4">Total: ${total.toFixed(2)}</div>
                <Button className="w-full mt-4">Confirmar Pedido</Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

