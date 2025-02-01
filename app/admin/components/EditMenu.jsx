import { useState, useEffect } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updateDish, deleteDish, getMenu } from "@/lib/menuActions"
import Image from "next/image"

export default function EditMenu({ categories }) {
  const [dishes, setDishes] = useState([])
  const [editingDish, setEditingDish] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const categoriesArray = Object.values(categories).sort((a, b) => a.order - b.order)


  useEffect(() => {
    fetchDishes()
  }, [])

  const fetchDishes = async () => {
    try {
      const menuData = await getMenu()
      setDishes(menuData || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los platos.",
      })
    }
  }

  const handleUpdateDish = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      Object.keys(editingDish).forEach((key) => {
        if (key === "image") {
          if (editingDish.image instanceof File) {
            formData.append("image", editingDish.image)
          }
        } else {
          formData.append(key, editingDish[key])
        }
      })

      const response = await updateDish(editingDish.dishId, formData)
      if (response.statusCode === 200) {
        setDishes(dishes.map((dish) => (dish.dishId === editingDish.dishId ? response.dish : dish)))
        setEditingDish(null)
        toast({
          title: "Plato actualizado",
          description: "El plato se ha actualizado con éxito.",
        })
      } else {
        throw new Error(response.message || "No se pudo actualizar el plato")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo actualizar el plato. Por favor, intente de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDish = async (id) => {
    setIsLoading(true)
    try {
      const success = await deleteDish(id)
      if (success) {
        setDishes(dishes.filter((d) => d.dishId !== id))
        toast({
          title: "Plato eliminado",
          description: "El plato se ha eliminado con éxito.",
        })
      } else {
        throw new Error("No se pudo eliminar el plato")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el plato. Por favor, intente de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditingDish({ ...editingDish, image: file })
    }
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-bold text-xl mb-4">Editar Menú</h2>
      <Accordion type="single" collapsible className="w-full">
        {categoriesArray?.map((category) => (
          <AccordionItem key={category.name} value={category.name}>
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionContent>
              {dishes.filter((d) => d.category === category.name).length === 0 ? (
                <p>No hay platos en esta categoría.</p>
              ) : (
                dishes
                  .filter((d) => d.category === category.name)
                  .map((dish) => (
                    <div key={dish.dishId} className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {dish.image && (
                          <Image
                            src={dish.image || "/placeholder.svg"}
                            alt={dish.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{dish.name}</h3>
                          <p className="text-sm text-gray-600">{dish.description}</p>
                          <p className="text-sm font-medium">{dish.price}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setEditingDish(dish)}>
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Editar Plato</DialogTitle>
                              <DialogDescription>
                                Realiza cambios en los detalles del plato aquí. Haz clic en guardar cuando hayas
                                terminado.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Nombre
                                </Label>
                                <Input
                                  id="name"
                                  value={editingDish?.name || ""}
                                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                  Descripción
                                </Label>
                                <Textarea
                                  id="description"
                                  value={editingDish?.description || ""}
                                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                  Precio
                                </Label>
                                <Input
                                  id="price"
                                  value={editingDish?.price || ""}
                                  onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">
                                  Imagen
                                </Label>
                                <Input id="image" type="file" onChange={handleImageUpload} className="col-span-3" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="vegetarian"
                                  checked={editingDish?.isVegetarian || false}
                                  onCheckedChange={(checked) =>
                                    setEditingDish({ ...editingDish, isVegetarian: checked })
                                  }
                                />
                                <Label htmlFor="vegetarian">Vegetariano</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="gluten-free"
                                  checked={editingDish?.isGlutenFree || false}
                                  onCheckedChange={(checked) =>
                                    setEditingDish({ ...editingDish, isGlutenFree: checked })
                                  }
                                />
                                <Label htmlFor="gluten-free">Sin Gluten</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="customizable"
                                  checked={editingDish?.customizable || false}
                                  onCheckedChange={(checked) =>
                                    setEditingDish({ ...editingDish, customizable: checked })
                                  }
                                />
                                <Label htmlFor="customizable">Personalizable</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleUpdateDish} disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar cambios"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" onClick={() => setEditingDish(dish)}>
                              Eliminar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar eliminación</DialogTitle>
                              <DialogDescription>
                                ¿Estás seguro de que quieres eliminar este plato? Esta acción no se puede deshacer.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingDish(null)}>
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteDish(dish.dishId)}
                                disabled={isLoading}
                              >
                                {isLoading ? "Eliminando..." : "Eliminar"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

