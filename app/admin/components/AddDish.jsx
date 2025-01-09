import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AddDish({ categories, setDishes, addDish, showToast }) {
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (newDish.name && newDish.description && newDish.price && newDish.category) {
      const success = await addDish(newDish);
      if (success) {
        setDishes(prev => [...prev, { ...newDish, id: Date.now() }]);
        setNewDish({ name: '', description: '', price: '', category: '', image: null });
        showToast('Plato añadido con éxito');
      } else {
        showToast('Error al añadir el plato', 'error');
      }
    } else {
      showToast('Por favor, complete todos los campos', 'error');
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Añadir Nuevo Plato</h2>
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
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Añadir Plato</Button>
      </form>
    </div>
  );
}
