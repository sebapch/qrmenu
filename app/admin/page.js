'use client';

import { useState, useEffect } from 'react';
import { ToastProvider, Toast, ToastViewport } from "@/components/ui/toast";
import Link from 'next/link';
import { getMenu, getCategories, addCategory, addDish, updateDish, deleteDish } from '@/lib/menuActions';

import CategoriesManager from './components/CategoriesManager';
import EditMenu from './components/EditMenu';
import AddDish from './components/AddDish';

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const menuData = await getMenu();
        const loadedCategories = await getCategories();
        setCategories(loadedCategories || []);
        setDishes(menuData.dishes || []);
      } catch (error) {
        showToast('Error al cargar el menú', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-100 flex flex-col">
        <header className="bg-stone-800 text-white py-6 sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-serif font-bold text-center">Le Gourmet Exquis - Admin</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Link href="/" className="text-stone-600 hover:text-stone-800 mb-4 inline-block">&larr; Volver al menú</Link>
          <div className="grid gap-8 md:grid-cols-2">
            <CategoriesManager
              categories={categories}
              setCategories={setCategories}
              addCategory={addCategory}
              showToast={showToast}
            />
            <AddDish
              categories={categories}
              setDishes={setDishes}
              addDish={addDish}
              showToast={showToast}
            />
          </div>
          <EditMenu
            categories={categories}
            dishes={dishes}
            setDishes={setDishes}
            updateDish={updateDish}
            deleteDish={deleteDish}
            showToast={showToast}
          />
        </main>
        <footer className="bg-stone-800 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">Desarrollado por Juan Pérez</p>
            <p className="text-sm mt-1">
              <a href="mailto:juan@example.com" className="hover:underline">juan@example.com</a> | 
              <a href="https://github.com/juanperez" target="_blank" rel="noopener noreferrer" className="ml-2 hover:underline">GitHub</a>
            </p>
          </div>
        </footer>
        {toast.visible && (
          <div className="fixed bottom-4 right-4 z-50">
            <Toast variant={toast.type === 'error' ? 'destructive' : 'default'}>
              <div className="flex items-center">
                <span className={`bg-${toast.type === 'error' ? 'red' : 'green'}-500 rounded-full p-1 mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                    {toast.type === 'error' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                </span>
                <span className="font-medium">{toast.message}</span>
              </div>
            </Toast>
          </div>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
