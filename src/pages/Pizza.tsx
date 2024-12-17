import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const pizzaCategories = [
  {
    id: 'neapolitan',
    title: 'Neapolitan',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Traditional Italian pizza with a thin base and high crust'
  },
  {
    id: 'new-york',
    title: 'New York Style',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Large, foldable slices with a crispy outer crust'
  },
  {
    id: 'detroit',
    title: 'Detroit Style',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Square pizza with a thick, crispy crust'
  },
  {
    id: 'chicago',
    title: 'Chicago Deep Dish',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Deep, thick pizza with layers of cheese and sauce'
  },
  {
    id: 'sicilian',
    title: 'Sicilian',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Thick-crust, rectangular pizza with robust toppings'
  },
  {
    id: 'thin-crispy',
    title: 'Thin & Crispy',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Ultra-thin, crispy crust with light toppings'
  },
  {
    id: 'american',
    title: 'American',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Classic American-style with various toppings'
  },
  {
    id: 'other',
    title: 'Other Styles',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    description: 'Discover unique and fusion pizza styles'
  }
];

const Pizza = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-textLight mb-8">Pizza Styles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pizzaCategories.map((category) => (
            <Link
              key={category.id}
              to={`/pizza/${category.id}`}
              className="group relative overflow-hidden rounded-lg aspect-square hover:transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-textLight mb-2">{category.title}</h3>
                <p className="text-sm text-gray-300">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pizza;