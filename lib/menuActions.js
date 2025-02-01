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
    const categoriesArray = JSON.parse(data.body).categories || [];
    
    // Transformar el array de strings en array de objetos con name y order
    const categoriesWithOrder = categoriesArray.map((categoryName, index) => ({
      name: categoryName,
      order: index + 1
    }));

    return categoriesWithOrder;
    
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [];
  }
};


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


export const addDish = async (dishData) => {
  try {
    // Convertir los datos a un objeto plano
    const payload = {
      name: dishData.get('name'),
      description: dishData.get('description'),
      price: dishData.get('price'),
      category: dishData.get('category'),
      isVegetarian: dishData.get('isVegetarian'),
      isGlutenFree: dishData.get('isGlutenFree'),
      customizable: dishData.get('customizable')
    };

    // Si hay una imagen, convertirla a base64
    if (dishData.get('image')) {
      const imageFile = dishData.get('image');
      const reader = new FileReader();
      
      // Convertir la imagen a base64
      const base64Image = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      
      payload.image = base64Image;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al añadir el plato');
    }

    const data = await response.json();
    return {
      statusCode: response.status,
      dish: data.dish
    };
  } catch (error) {
    console.error('Error al añadir el plato:', error);
    throw error;
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
  // Obtener las categorías que tienen platos
  const categoriesWithDishes = categories
    .filter(category => menu.some(dish => dish.category === category.name))
    .sort((a, b) => a.order - b.order)
    .map(category => category.name);

  return categoriesWithDishes;
};

export const updateCategoryOrder = async (categories) => {
  try {
    const validCategories = categories.filter(Boolean);
    
    if (!validCategories.length) {
      throw new Error('No hay categorías válidas para actualizar');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categories: validCategories,
        updatedAt: new Date().toISOString() // Añadimos timestamp para forzar actualización
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el orden de las categorías');
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error('Error al actualizar el orden:', error);
    return false;
  }
};