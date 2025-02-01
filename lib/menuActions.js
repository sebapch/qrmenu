// Asume que NEXT_PUBLIC_API_URL está configurado en el archivo .env.local
// Por ejemplo: NEXT_PUBLIC_API_URL=http://localhost:3000/api

export const getMenu = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener los platos")
    }

    const data = await response.json()
    const parsedData = JSON.parse(data.body)
    return parsedData.dishes || []
  } catch (error) {
    console.error("Error al obtener los platos:", error)
    return []
  }
}

export const getCategories = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las categorías");
    }

    const data = await response.json();
    const parsedData = JSON.parse(data.body);
    // Aseguramos que las categorías tengan un orden basado en su posición
    const categoriesWithOrder = parsedData.categories.map((category, index) => ({
      name: category,
      order: index + 1
    }));
    return categoriesWithOrder || [];
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [];
  }
};

// Mantenemos las demás funciones igual por ahora
export const addCategory = async (newCategory) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName: newCategory }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al añadir la categoría');
    }

    await response.json();
    return true;
  } catch (error) {
    console.error('Error al añadir la categoría:', error);
    return false;
  }
};


export const addDish = async (newDish) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDish),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al añadir la categoría');
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error('Error al añadir la categoría:', error);
    return false;
  }
};

export const updateDish = async (updatedDish) => {
  // Simula una llamada a API para actualizar un plato
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = dishes.findIndex(dish => dish.id === updatedDish.id);
      if (index !== -1) {
        dishes[index] = updatedDish;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

export const deleteDish = async (id) => {
  // Simula una llamada a API para eliminar un plato
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = dishes.length;
      dishes = dishes.filter(dish => dish.id !== id);
      resolve(dishes.length < initialLength);
    }, 500);
  });
};

export const getFilteredCategories = (menu, categories) => {
  return categories.filter((category) => menu.some((dish) => dish.category === category))
}

export const updateCategoryOrder = async (updatedCategories) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories: updatedCategories.map(cat => cat.name) }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el orden de las categorías');
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar el orden:', error);
    return false;
  }
};