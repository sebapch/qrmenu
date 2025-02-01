import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addCategory, getCategories, updateCategoryOrder } from "@/lib/menuActions"
import { ArrowUp, ArrowDown } from "lucide-react"

export default function CategoriesManager() {
  const [categories, setCategories] = useState({})
  const [categoryArray, setCategoryArray] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
      // Convertir el objeto de categorías a array para la visualización
      const categoriesArray = Object.values(fetchedCategories)
      .sort((a, b) => a.order - b.order) // Ordenar por el campo order
    setCategoryArray(categoriesArray)
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

    if (categories[newCategory.toLowerCase().trim()]) {
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
          title: "Éxito",
          description: "Categoría añadida correctamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir la categoría.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const moveCategory = (index, direction) => {
    const newCategoryArray = [...categoryArray];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < categoryArray.length) {
      // Intercambiar categorías
      [newCategoryArray[index], newCategoryArray[newIndex]] = 
      [newCategoryArray[newIndex], newCategoryArray[index]];

      // Actualizar orden
      const updatedCategories = newCategoryArray.map((cat, idx) => ({
        ...cat,
        order: idx + 1
      }));

      setCategoryArray(updatedCategories);
      setHasChanges(true);
    }
  };

  const handleSaveOrder = async () => {
    if (!categoryArray.length) return;

    setIsLoading(true);
    try {
      const categoryNames = categoryArray.map(cat => cat.name);
      const success = await updateCategoryOrder(categoryNames);
      
      if (success) {
        setHasChanges(false);
        // Actualizar las categorías localmente con el nuevo orden
        const updatedCategories = categoryArray.map((cat, index) => ({
          ...cat,
          order: index + 1
        }));
        setCategoryArray(updatedCategories);
        
        toast({
          title: "Éxito",
          description: "Orden actualizado correctamente.",
        });
        
        await fetchCategories();
      } else {
        throw new Error('No se pudo actualizar el orden');
      }
    } catch (error) {
      console.error('Error al guardar el orden:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el orden de las categorías.",
      });
      await fetchCategories();
    } finally {
      setIsLoading(false);
    }
  };

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
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir Categoría"}
        </Button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Categorías Existentes</h3>
        {hasChanges && (
          <Button
            onClick={handleSaveOrder}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Guardando..." : "Guardar Orden"}
          </Button>
        )}
      </div>

      <div className="space-y-2 min-h-[50px]">
        {categoryArray?.map((category, index) => (
          <div
            key={category.name}
            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow-sm hover:shadow transition-shadow duration-200"
          >
            <span>{category.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm mr-2">
                Orden: {category.order}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveCategory(index, 'up')}
                  disabled={index === 0 || isLoading}
                  className="h-8 w-8"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveCategory(index, 'down')}
                  disabled={index === categoryArray.length - 1 || isLoading}
                  className="h-8 w-8"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}