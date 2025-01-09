import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export default function EditMenu({ categories, dishes, setDishes, updateDish, deleteDish, showToast }) {
  const handleDeleteDish = async (id) => {
    const success = await deleteDish(id);
    if (success) {
      setDishes(dishes.filter(d => d.id !== id));
      showToast('Plato eliminado con éxito');
    } else {
      showToast('Error al eliminar el plato', 'error');
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Editar Menú</h2>
      <Accordion type="single" collapsible>
        {categories.map(category => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              {dishes.filter(d => d.category === category).length === 0 ? (
                <p>No hay platos en esta categoría.</p>
              ) : (
                dishes.filter(d => d.category === category).map(dish => (
                  <div key={dish.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                    {dish.image && (
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div>
                      <h3>{dish.name}</h3>
                      <p>{dish.description}</p>
                      <p>{dish.price}</p>
                      <Button onClick={() => console.log('Editar plato:', dish)}>Editar</Button>
                      <Button variant="destructive" onClick={() => handleDeleteDish(dish.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
