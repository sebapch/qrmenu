import { useState } from "react"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CustomizeDialog({ dish, cartItem, updateCart }) {
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1)
  const [observation, setObservation] = useState(cartItem?.observation || "")

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change))
  }

  const handleSubmit = () => {
    const quantityChange = quantity - (cartItem?.quantity || 0)
    updateCart(dish.dishId, quantityChange, observation)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Personalizar {dish.name}</DialogTitle>
        <DialogDescription>Ajusta la cantidad y añade instrucciones especiales para tu pedido.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Cantidad:</span>
          <div className="flex items-center space-x-2">
            <Button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
              -
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button onClick={() => handleQuantityChange(1)}>+</Button>
          </div>
        </div>
        <Textarea
          placeholder="Instrucciones especiales (ej: sin cebolla, cocción media, etc.)"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          rows={4}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Aceptar cambios
      </Button>
    </DialogContent>
  )
}

