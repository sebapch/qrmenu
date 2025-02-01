import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addCategory, getCategories, updateCategoryOrder } from "@/lib/menuActions"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default function CategoriesManager() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las categorías.",
      })
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío.",
      })
      return
    }

    if (categories.some((cat) => cat.name.toLowerCase() === newCategory.toLowerCase().trim())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Esta categoría ya existe.",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await addCategory(newCategory.trim())
      if (success) {
        await fetchCategories()
        setNewCategory("")
        toast({
          title: "Categoría añadida",
          description: "La categoría se ha añadido con éxito.",
        })
      } else {
        throw new Error("No se pudo añadir la categoría")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir la categoría. Por favor, intente de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onDragEnd = async (result) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedCategories = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }))

    setCategories(updatedCategories)

    try {
      await updateCategoryOrder(updatedCategories)
      toast({
        title: "Orden actualizado",
        description: "El orden de las categorías se ha actualizado con éxito.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el orden de las categorías.",
      })
      // Revertir cambios en caso de error
      await fetchCategories()
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-bold text-xl mb-4">Gestionar Categorías</h2>
      <form onSubmit={handleAddCategory} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="category-name">Nombre de la Categoría</Label>
          <Input
            id="category-name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Ej: Especialidades del Chef"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir Categoría"}
        </Button>
      </form>

      <h3 className="font-semibold text-lg mb-2">Categorías Existentes</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {categories.map((category, index) => (
                <Draggable key={category.name} draggableId={category.name} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-100 p-2 rounded flex justify-between items-center"
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-500">Orden: {category.order}</span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}