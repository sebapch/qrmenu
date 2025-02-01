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
import { Minus, Plus, Leaf, Wheat } from "lucide-react";
import Cart from "../components/cart";
import { getMenu, getCategories } from "../lib/menuActions";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [observation, setObservation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [menuData, categoriesData] = await Promise.all([
          getMenu(),
          getCategories(),
        ]);

        setMenu(menuData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateCart = (dishId, quantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      [dishId]: (prevCart[dishId] || 0) + quantity,
    }));
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
                alt="United States"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
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
              />            </Button>
            <Button variant="ghost" size="icon">
              <Image
                alt="United States"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
                width={24}
                height={24}
              />
            </Button>
          </div>
        </div>
      </header>
      <nav className="bg-stone-200 shadow-sm sticky top-[76px] z-10">
        <div className="container mx-auto px-4 py-2 overflow-x-auto whitespace-nowrap">
          {categories.map((category, index) => (
            <a
              key={index}
              href={`#${category}`}
              className="inline-block px-3 py-2 text-stone-800 font-semibold hover:bg-stone-300 rounded-md mr-2"
            >
              {category}
            </a>
          ))}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6 flex-grow">
        {categories.map((category, categoryIndex) => (
          <section key={categoryIndex} id={category} className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 text-stone-800 border-b border-stone-300 pb-2">
              {category}
            </h2>
            <div className="space-y-4">
              {menu
                .filter((dish) => dish.category === category)
                .map((dish) => (
                  <Card
                    key={dish.dishId}
                    className="overflow-hidden bg-white shadow rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row">
                      {dish.image && (
                        <Image
                          src={dish.image || "/placeholder.svg"}
                          alt={dish.name}
                          width={150}
                          height={150}
                          className="object-cover w-full h-40 md:w-40 md:h-auto"
                        />
                      )}
                      <div className="flex-grow p-4">
                        <CardHeader className="p-0">
                          <CardTitle className="flex items-center">
                            {dish.name}
                            {dish.isVegetarian && (
                              <Leaf className="ml-2 text-green-500" size={16} />
                            )}
                            {dish.isGlutenFree && (
                              <Wheat
                                className="ml-2 text-amber-500"
                                size={16}
                              />
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
                              {cart[dish.dishId] || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateCart(dish.dishId, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
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

      <Cart
        cart={cart}
        menu={menu}
        updateCart={updateCart}
        observation={observation}
        setObservation={setObservation}
      />

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
