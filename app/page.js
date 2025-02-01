"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Leaf, Wheat, Edit } from "lucide-react";
import Cart from "../components/cart";
import CategorySelector from "../components/CategorySelector";
import {
  getMenu,
  getCategories,
  getFilteredCategories,
} from "../lib/menuActions";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CustomizeDialog from "../components/CustomizeDialog";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [menuData, categoriesData] = await Promise.all([
          getMenu(),
          getCategories(),
        ]);

        // Asegurarse de que menuData es un array
        const validMenuData = Array.isArray(menuData) ? menuData : [];

        // Asegurarse de que categoriesData es un array
        const validCategoriesData = Array.isArray(categoriesData)
          ? categoriesData
          : [];

        // Agregar customizable a todos los platos
        const menuWithCustomizable = validMenuData.map((dish) => ({
          ...dish,
          customizable: true,
          isVegetarian: dish.isVegetarian || false,
          isGlutenFree: dish.isGlutenFree || false,
        }));

        setMenu(menuWithCustomizable);
        console.log(menuWithCustomizable)
        setCategories(validCategoriesData);

        // Obtener categorías filtradas
        const filtered = getFilteredCategories(
          menuWithCustomizable,
          validCategoriesData
        );
        setFilteredCategories(filtered);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "No se pudo cargar el menú. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateCart = (dishId, quantity, observation = "") => {
    setCart((prevCart) => {
      const newQuantity = (prevCart[dishId]?.quantity || 0) + quantity;
      if (newQuantity <= 0) {
        const { [dishId]: _, ...rest } = prevCart;
        return rest;
      }
      return {
        ...prevCart,
        [dishId]: {
          quantity: newQuantity,
          observation: observation || prevCart[dishId]?.observation || "",
        },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-xl text-stone-600">Cargando menú...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-stone-800 text-white py-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-serif font-bold text-center">
            Le Gourmet Exquis
          </h1>
          <p className="text-center mt-1 text-stone-300 italic text-sm">
            Una experiencia culinaria excepcional
          </p>
          <div className="flex justify-center mt-2 space-x-2">
            <Button variant="ghost" size="icon">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Español"
                width={24}
                height={24}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Image
                alt="United States"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
                width={24}
                height={24}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Italiano"
                width={24}
                height={24}
              />
            </Button>
          </div>
        </div>
      </header>
      <nav className="sticky top-[76px] z-10">
        <CategorySelector categories={filteredCategories} />
      </nav>
      <main className="container mx-auto px-4 py-6 flex-grow">
        {filteredCategories.map((category) => (
          <section key={category} id={category} className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 text-stone-800 border-b border-stone-300 pb-2">
              {category}
            </h2>
            <div className="space-y-4">
              {menu
                .filter((dish) => dish.category === category)
                .map((dish) => (
                  <Card key={dish.dishId} className="overflow-hidden bg-white shadow rounded-lg">
                    <div className="flex flex-col md:flex-row">
                      {dish.image && (
                        <div className="relative w-full h-40 md:w-40 md:h-40">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow p-4">
                        <CardHeader className="p-0">
                          <CardTitle className="flex items-center text-black">
                            {dish.name}
                            {dish.isVegetarian && <Leaf className="ml-2 text-green-500" size={16} />}
                            {dish.isGlutenFree && <Wheat className="ml-2 text-amber-500" size={16} />}
                            {dish.customizable && (
                              <span className="ml-2 text-blue-500 text-sm">(Personalizable)</span>
                            )}
                          </CardTitle>
                          <CardDescription>{dish.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-2">
                          <p className="text-lg font-semibold text-stone-800">
                            Precio: ${dish.price}
                          </p>
                        </CardContent>
                        <CardFooter className="p-0 mt-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateCart(dish.dishId, -1)}
                              disabled={!cart[dish.dishId]}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {cart[dish.dishId]?.quantity || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateCart(dish.dishId, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            {dish.customizable && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="ml-2">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Personalizar
                                  </Button>
                                </DialogTrigger>
                                <CustomizeDialog
                                  dish={dish}
                                  cartItem={cart[dish.dishId]}
                                  updateCart={updateCart}
                                />
                              </Dialog>
                            )}
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </section>
        ))}
      </main>

      <Cart cart={cart} menu={menu} updateCart={updateCart} />

      <footer className="bg-stone-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Desarrollado por Juan Pérez</p>
          <p className="text-sm mt-1">
            <a href="mailto:juan@example.com" className="hover:underline">
              juan@example.com
            </a>{" "}
            |
            <a
              href="https://github.com/juanperez"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
