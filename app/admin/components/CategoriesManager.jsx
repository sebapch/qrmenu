import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CategoriesManager({ categories, setCategories, addCategory, showToast }) {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      const success = await addCategory(newCategory);
      if (success) {
        setCategories([...categories, newCategory]);
        setNewCategory('');
        showToast('Categoría añadida con éxito');
      } else {
        showToast('Error al añadir la categoría', 'error');
      }
    } else {
      showToast('La categoría ya existe o está vacía', 'error');
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Añadir Nueva Categoría</h2>
      <form onSubmit={handleAddCategory} className="space-y-4">
        <div>
          <Label htmlFor="category-name">Nombre de la Categoría</Label>
          <Input
            id="category-name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Ej: Especialidades del Chef"
          />
        </div>
        <Button type="submit">Añadir Categoría</Button>
      </form>
    </div>
  );
}
