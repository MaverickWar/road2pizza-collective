import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ArrowLeft } from 'lucide-react';

const pizzaStyles = {
  "neapolitan": {
    title: "Neapolitan Pizza",
    description: "The original pizza from Naples, characterized by its thin base, high crust, and minimal toppings. Cooked at very high temperatures in a wood-fired oven.",
    history: "Dating back to the 18th century in Naples, Italy, this style is considered the original pizza. Traditional Neapolitan pizza has a thin crust with a fluffy, charred cornicione (rim).",
    recipes: [
      {
        id: "1",
        title: "Perfect Neapolitan Dough",
        description: "Master the art of traditional Neapolitan pizza dough with this authentic recipe.",
        image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        difficulty: "Intermediate",
        time: "24 hours"
      },
      {
        id: "2",
        title: "Mastering Wood-Fired Ovens",
        description: "Learn the techniques for perfect wood-fired Neapolitan pizza.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        difficulty: "Advanced",
        time: "2-3 hours"
      },
      {
        id: "3",
        title: "Seasonal Toppings Guide",
        description: "Explore traditional and modern topping combinations for Neapolitan pizza.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        difficulty: "Easy",
        time: "30 mins"
      }
    ]
  },
  "new-york": {
    title: "New York Style Pizza",
    description: "Large, foldable slices with a crispy outer crust and chewy interior. Known for its perfect balance of sauce and cheese.",
    history: "Developed by Italian immigrants in New York City in the early 1900s, this style became an iconic symbol of the city's food culture.",
    recipes: []
  },
  "detroit": {
    title: "Detroit Style Pizza",
    description: "Square pizza with a thick, crispy crust, typically topped with Wisconsin brick cheese and sauce on top.",
    history: "Originally baked in automotive parts trays in the 1940s, Detroit-style pizza is known for its unique rectangular shape and crispy bottom.",
    recipes: []
  },
  "chicago": {
    title: "Chicago Deep Dish",
    description: "Deep, thick pizza with high edges, layered with cheese, meat, vegetables, and sauce on top.",
    history: "Invented at Pizzeria Uno in 1943, Chicago deep dish was designed to be a more filling and substantial meal.",
    recipes: []
  },
  "sicilian": {
    title: "Sicilian Pizza",
    description: "Thick-crust, rectangular pizza with robust toppings and a focaccia-like base.",
    history: "Derived from sfincione, a type of focaccia from Sicily, this style was brought to America by Sicilian immigrants.",
    recipes: []
  },
  "thin-crispy": {
    title: "Thin & Crispy Pizza",
    description: "Ultra-thin, crispy crust with light toppings, often with a cracker-like consistency.",
    history: "Popular in bars and restaurants across America, this style emphasizes crispiness and simplicity.",
    recipes: []
  },
  "american": {
    title: "American Pizza",
    description: "Classic American-style with various toppings, typically featuring a medium-thick crust.",
    history: "A fusion of various styles that developed across America, incorporating diverse regional influences.",
    recipes: []
  },
  "other": {
    title: "Other Pizza Styles",
    description: "Discover unique and fusion pizza styles from around the world.",
    history: "Pizza continues to evolve globally, with each region adding its own twist to this beloved dish.",
    recipes: []
  }
};

const PizzaStyle = () => {
  const { style } = useParams();
  const pizzaStyle = pizzaStyles[style as keyof typeof pizzaStyles];

  if (!pizzaStyle) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Style not found</h1>
          <Link to="/pizza" className="text-accent hover:text-highlight">Return to Pizza Styles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <Link to="/pizza" className="inline-flex items-center text-accent hover:text-highlight mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pizza Styles
        </Link>
        
        <h1 className="text-4xl font-bold text-textLight mb-4">{pizzaStyle.title}</h1>
        <p className="text-xl text-gray-300 mb-8">{pizzaStyle.description}</p>
        
        <div className="bg-secondary rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <p className="text-gray-300">{pizzaStyle.history}</p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Recipes</h2>
        {pizzaStyle.recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzaStyle.recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/article/${recipe.id}`}
                className="bg-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-video relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{recipe.description}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Difficulty: {recipe.difficulty}</span>
                    <span>{recipe.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">Recipes coming soon!</p>
        )}
      </div>
    </div>
  );
};

export default PizzaStyle;