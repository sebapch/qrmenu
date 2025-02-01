import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addDish } from "@/lib/menuActions"
import { Switch } from "@/components/ui/switch"

export default function AddDish({ categories, setDishes }) {
  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    isVegetarian: false,
    isGlutenFree: false,
    customizable: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddDish = async (e) => {
    e.preventDefault()
    if (newDish.name && newDish.description && newDish.price && newDish.category) {
      setIsLoading(true)
      try {
        const formData = new FormData()
        Object.keys(newDish).forEach((key) => {
          if (key === "image") {
            if (newDish.image) {
              formData.append("image", newDish.image)
            }
          } else {
            formData.append(key, newDish[key])
          }
        })

        const response = await addDish(formData)
        if (response.statusCode === 201) {
          setDishes((prev) => [...prev, response.dish])
          setNewDish({
            name: "",
            description: "",
            price: "",
            category: "",
            image: null,
            isVegetarian: false,
            isGlutenFree: false,
            customizable: false,
          })
          toast({
            title: "Plato añadido",
            description: "El plato se ha añadido con éxito.",
          })
        } else {
          throw new Error(response.message || "No se pudo añadir el plato")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "No se pudo añadir el plato. Por favor, intente de nuevo.",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete todos los campos obligatorios.",
      })
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewDish({ ...newDish, image: file })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-bold text-xl mb-4">Añadir Nuevo Plato</h2>
      <form onSubmit={handleAddDish} className="space-y-4">
        <div>
          <Label htmlFor="dish-name">Nombre del Plato</Label>
          <Input
            id="dish-name"
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            placeholder="Ej: Risotto de Trufa Negra"
          />
        </div>
        <div>
          <Label htmlFor="dish-description">Descripción</Label>
          <Textarea
            id="dish-description"
            value={newDish.description}
            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            placeholder="Describe el plato"
          />
        </div>
        <div>
          <Label htmlFor="dish-price">Precio</Label>
          <Input
            id="dish-price"
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
            placeholder="Ej: €25"
          />
        </div>
        <div>
          <Label htmlFor="dish-category">Categoría</Label>
          <Select onValueChange={(value) => setNewDish({ ...newDish, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dish-image">Imagen del Plato</Label>
          <Input id="dish-image" type="file" onChange={handleImageUpload} accept="image/*" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="dish-vegetarian"
            checked={newDish.isVegetarian}
            onCheckedChange={(checked) => setNewDish({ ...newDish, isVegetarian: checked })}
          />
          <Label htmlFor="dish-vegetarian">Vegetariano</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="dish-gluten-free"
            checked={newDish.isGlutenFree}
            onCheckedChange={(checked) => setNewDish({ ...newDish, isGlutenFree: checked })}
          />
          <Label htmlFor="dish-gluten-free">Sin Gluten</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="dish-customizable"
            checked={newDish.customizable}
            onCheckedChange={(checked) => setNewDish({ ...newDish, customizable: checked })}
          />
          <Label htmlFor="dish-customizable">Personalizable</Label>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir Plato"}
        </Button>
      </form>
    </div>
  )
}

