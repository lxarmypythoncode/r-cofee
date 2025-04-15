
// Menu data to simulate database content
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'coffee' | 'tea' | 'pastry' | 'breakfast' | 'lunch' | 'dessert';
};

export const menuItems: MenuItem[] = [
  // Coffee
  {
    id: 1,
    name: "Espresso",
    description: "Concentrated coffee served in a small, strong shot.",
    price: 3.5,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=2070&auto=format&fit=crop",
    category: "coffee"
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and milk foam.",
    price: 4.5,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=2070&auto=format&fit=crop",
    category: "coffee"
  },
  {
    id: 3,
    name: "Latte",
    description: "Espresso with steamed milk and a light layer of foam.",
    price: 4.75,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=2075&auto=format&fit=crop",
    category: "coffee"
  },
  {
    id: 4,
    name: "Americano",
    description: "Espresso diluted with hot water to a similar strength to coffee.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=2024&auto=format&fit=crop",
    category: "coffee"
  },
  {
    id: 5,
    name: "Mocha",
    description: "Espresso with steamed milk, chocolate, and whipped cream.",
    price: 5.25,
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1974&auto=format&fit=crop",
    category: "coffee"
  },
  
  // Tea
  {
    id: 6,
    name: "Green Tea",
    description: "Fresh brewed loose leaf green tea.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=2070&auto=format&fit=crop",
    category: "tea"
  },
  {
    id: 7,
    name: "Earl Grey",
    description: "Black tea infused with bergamot oil.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1974&auto=format&fit=crop",
    category: "tea"
  },
  
  // Pastries
  {
    id: 8,
    name: "Croissant",
    description: "Buttery, flaky, viennoiserie pastry.",
    price: 3.5,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2026&auto=format&fit=crop",
    category: "pastry"
  },
  {
    id: 9,
    name: "Blueberry Muffin",
    description: "Moist muffin filled with fresh blueberries.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1585477291617-97ac6c117d24?q=80&w=1976&auto=format&fit=crop",
    category: "pastry"
  },
  
  // Breakfast
  {
    id: 10,
    name: "Avocado Toast",
    description: "Sourdough toast topped with avocado, cherry tomatoes, and feta.",
    price: 8.5,
    image: "https://images.unsplash.com/photo-1603046891748-a640fd857a3b?q=80&w=1974&auto=format&fit=crop",
    category: "breakfast"
  },
  {
    id: 11,
    name: "Breakfast Sandwich",
    description: "Egg, bacon, and cheese on a toasted brioche bun.",
    price: 7.5,
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?q=80&w=1925&auto=format&fit=crop",
    category: "breakfast"
  },
  
  // Lunch
  {
    id: 12,
    name: "Chicken Salad",
    description: "Mixed greens, grilled chicken, avocado, and balsamic vinaigrette.",
    price: 12.5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    category: "lunch"
  },
  {
    id: 13,
    name: "Veggie Wrap",
    description: "Hummus, mixed vegetables, and feta wrapped in a spinach tortilla.",
    price: 9.5,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1964&auto=format&fit=crop",
    category: "lunch"
  },
  
  // Desserts
  {
    id: 14,
    name: "Chocolate Cake",
    description: "Rich, moist chocolate cake with ganache frosting.",
    price: 6.5,
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?q=80&w=1974&auto=format&fit=crop",
    category: "dessert"
  },
  {
    id: 15,
    name: "Tiramisu",
    description: "Coffee-soaked ladyfingers layered with mascarpone cream.",
    price: 7.0,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1974&auto=format&fit=crop",
    category: "dessert"
  }
];

export const getMenuItems = (): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuItems);
    }, 300); // Simulating network delay
  });
};

export const getMenuItemsByCategory = (category: MenuItem['category']): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuItems.filter(item => item.category === category));
    }, 300);
  });
};
