'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Home() {
  const [menu, setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes`)
        if (!response.ok) {
          throw new Error('Error al cargar el menú')
        }
        const data = await response.json()
        const dishes = JSON.parse(data?.body).dishes || []
        
        // Agrupar platos por categoría
        const groupedMenu = dishes.reduce((acc, dish) => {
          const category = dish.category
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(dish)
          return acc
        }, {})

        setMenu(groupedMenu)
      } catch (err) {
        console.error('Error fetching menu:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-xl text-stone-600">Cargando menú...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-stone-800 text-white py-6 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-center">Le Gourmet Exquis</h1>
          <p className="text-center mt-1 text-stone-300 italic text-sm">Una experiencia culinaria excepcional</p>
        </div>
      </header>
      <div className="h-[76px]"></div>
      <nav className="bg-stone-200 shadow-sm mt-4">
        <div className="container mx-auto px-4 py-2 overflow-x-auto whitespace-nowrap">
          {Object.keys(menu).map((category) => (
            <a 
              key={category} 
              href={`#${category}`} 
              className="inline-block px-3 py-2 text-stone-800 font-semibold hover:bg-stone-300 rounded-md mr-2"
            >
              {category}
            </a>
          ))}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6 flex-grow">
        {Object.keys(menu).map((category) => (
          <section key={category} id={category} className="mb-8 pt-4">
            <h2 className="text-2xl font-serif font-bold mb-4 text-stone-800 border-b border-stone-300 pb-2">
              {category}
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {menu[category].map((dish) => (
                <Card key={dish.dishId} className="overflow-hidden bg-white p-4 shadow rounded-lg">
                  {dish.image && (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={300}
                      height={200}
                      className="rounded-md object-cover mb-4"
                    />
                  )}
                  <CardHeader>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardDescription>{dish.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-stone-800">Precio: {dish.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Link href="/admin" className="mt-8 inline-block text-center w-full text-stone-600 hover:text-stone-800">
        Administrar Menú
      </Link>
      <footer className="bg-stone-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Desarrollado por Juan Pérez</p>
          <p className="text-sm mt-1">
            <a href="mailto:juan@example.com" className="hover:underline">juan@example.com</a> | 
            <a href="https://github.com/juanperez" target="_blank" rel="noopener noreferrer" className="ml-2 hover:underline">GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
