import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';

const articles = {
  "1": {
    title: "Perfect Neapolitan Dough",
    author: "Maria Romano",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Technique",
    prepTime: "20 mins",
    cookTime: "90 seconds",
    servings: "4 pizzas",
    difficulty: "Intermediate",
    ingredients: [
      "1000g 00 flour",
      "600ml cold water",
      "20g fine sea salt",
      "3g fresh yeast"
    ],
    content: `
      The art of making Neapolitan pizza dough is a time-honored tradition that requires patience, precision, and understanding. The perfect dough begins with just four ingredients: flour, water, salt, and yeast. However, it's the technique and timing that transforms these simple ingredients into the characteristic light, airy, and chewy crust that defines Neapolitan pizza.

      Start with high-quality 00 flour, which has a fine texture and the right protein content. The hydration level should be around 60-65%, creating a dough that's workable yet wet enough to develop proper gluten structure. Allow for a long, slow fermentation at room temperature (about 8-12 hours) followed by ball-forming and a second rise.

      The key to success lies in maintaining the right temperature throughout the process and handling the dough with respect and care. Remember, great pizza dough is born from both technique and patience.
    `,
    instructions: [
      "Mix flour and water until shaggy dough forms",
      "Rest for 20 minutes (autolyse)",
      "Add salt and yeast, mix until smooth",
      "Bulk ferment for 8-12 hours at room temperature",
      "Divide and ball, then proof for 4-6 hours"
    ],
    tips: [
      "Use 00 flour for authentic texture",
      "Keep water temperature at 65°F (18°C)",
      "Allow for proper fermentation time",
      "Handle dough gently to preserve air bubbles"
    ],
    nutritionInfo: {
      calories: "250 per serving",
      protein: "8g",
      carbs: "48g",
      fat: "2g"
    }
  },
  "2": {
    title: "Mastering Wood-Fired Ovens",
    author: "Marco Rossi",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Equipment",
    prepTime: "30 mins",
    cookTime: "90 seconds",
    servings: "2 pizzas",
    difficulty: "Advanced",
    ingredients: [
      "Wood for firing",
      "Pizza stone",
      "High-quality pizza dough",
      "Toppings of choice"
    ],
    content: `
      Wood-fired ovens are the heart of traditional pizza making. These ovens can reach temperatures of up to 900°F (482°C), cooking a pizza to perfection in just 60-90 seconds. The combination of intense heat and wood smoke creates the distinctive char and flavor that defines authentic Neapolitan pizza.

      Managing a wood-fired oven requires skill and experience. The fire must be built and maintained properly to achieve the right temperature distribution. The dome of the oven should be white-hot, while the floor maintains a slightly lower temperature to prevent burning the bottom of the pizza.

      Understanding how to read the oven's temperature and manage the fire is crucial for consistent results. Each type of wood brings its own character to the cooking process, with hardwoods like oak and maple being preferred for their long, steady burn and subtle flavor contribution.
    `,
    instructions: [
      "Start the fire 2-3 hours before cooking",
      "Use well-seasoned hardwood",
      "Maintain dome temperature around 850-900°F",
      "Rotate pizzas for even cooking"
    ],
    tips: [
      "Ensure proper ventilation",
      "Use a pizza peel for easy transfer",
      "Experiment with different woods for flavor",
      "Keep a close eye on cooking times"
    ],
    nutritionInfo: {
      calories: "300 per serving",
      protein: "10g",
      carbs: "50g",
      fat: "5g"
    }
  },
  "3": {
    title: "Seasonal Toppings Guide",
    author: "Sophie Chen",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Ingredients",
    prepTime: "15 mins",
    cookTime: "10 mins",
    servings: "4 pizzas",
    difficulty: "Easy",
    ingredients: [
      "Fresh seasonal vegetables",
      "High-quality cheese",
      "Olive oil",
      "Herbs and spices"
    ],
    content: `
      The best pizzas are made with seasonal ingredients that are at their peak of flavor. Each season brings its own unique combinations and possibilities. Spring offers tender vegetables like asparagus and peas, while summer brings an abundance of tomatoes, basil, and zucchini.

      Fall is perfect for mushrooms, squash, and sage, creating hearty, satisfying combinations. Winter calls for preserved ingredients and hardy vegetables like kale and Brussels sprouts. Understanding seasonality not only ensures the best flavor but also supports sustainable cooking practices.

      Remember that less is more when it comes to toppings. Choose ingredients that complement each other and don't overwhelm the delicate balance of the pizza. Quality always trumps quantity.
    `,
    instructions: [
      "Choose ingredients based on the season",
      "Prep vegetables by washing and cutting",
      "Layer toppings evenly on the dough",
      "Bake until cheese is bubbly and crust is golden"
    ],
    tips: [
      "Visit local farmers' markets for fresh produce",
      "Experiment with different flavor combinations",
      "Use herbs to enhance the taste",
      "Don't overload the pizza"
    ],
    nutritionInfo: {
      calories: "200 per serving",
      protein: "7g",
      carbs: "30g",
      fat: "8g"
    }
  },
  "4": {
    title: "Classic NY Pizza Dough",
    author: "Tony Romano",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    category: "New York Style",
    prepTime: "30 mins",
    cookTime: "12-15 mins",
    servings: "2 large pizzas",
    difficulty: "Intermediate",
    ingredients: [
      "1000g bread flour",
      "600ml cool water",
      "10g instant yeast",
      "20g salt",
      "15g olive oil"
    ],
    content: `
      New York-style pizza dough is all about developing the right gluten structure for that characteristic fold. The dough should be strong enough to be stretched thin while maintaining its integrity.

      The key to authentic New York pizza dough lies in the protein content of the flour and the long, cold fermentation process. This develops both flavor and the right texture for that perfect fold.

      Water content and temperature control are crucial factors. The hydration level should be around 60-65%, creating a dough that's workable yet wet enough to create a chewy texture when baked.
    `,
    instructions: [
      "Mix flour and water until shaggy dough forms",
      "Add yeast, salt, and oil, mix until smooth",
      "Knead for 10-15 minutes until elastic",
      "Cold ferment for 24-72 hours",
      "Shape into balls and proof for 2 hours"
    ],
    tips: [
      "Use high-protein bread flour",
      "Cold fermentation is key for flavor",
      "Don't skip the oil - it helps with texture",
      "Room temperature ingredients work best"
    ],
    nutritionInfo: {
      calories: "250 per slice",
      protein: "8g",
      carbs: "48g",
      fat: "4g"
    }
  },
  "5": {
    title: "NY Pizza Sauce",
    author: "Maria Genovese",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    category: "New York Style",
    prepTime: "15 mins",
    cookTime: "45 mins",
    servings: "4 pizzas",
    difficulty: "Easy",
    ingredients: [
      "800g whole peeled tomatoes",
      "2 cloves garlic",
      "1 tbsp olive oil",
      "1 tsp dried oregano",
      "Salt and pepper to taste"
    ],
    content: `
      The perfect New York pizza sauce is all about simplicity. Unlike heavily seasoned sauces, NY-style sauce lets the natural sweetness of tomatoes shine through.

      Quality tomatoes are essential - San Marzano or other high-quality whole peeled tomatoes make the best sauce. The key is minimal cooking to preserve the fresh tomato flavor.

      The sauce should be slightly chunky but spreadable, with just enough seasoning to enhance the tomatoes without overwhelming them.
    `,
    instructions: [
      "Hand-crush whole tomatoes",
      "Sauté garlic in olive oil",
      "Add tomatoes and seasonings",
      "Simmer for 30-45 minutes",
      "Cool before using"
    ],
    tips: [
      "Use high-quality whole tomatoes",
      "Don't overcook the sauce",
      "Season conservatively",
      "Make ahead for best flavor"
    ],
    nutritionInfo: {
      calories: "45 per serving",
      protein: "1g",
      carbs: "6g",
      fat: "3g"
    }
  },
  "6": {
    title: "Detroit Style Pan Pizza",
    author: "Mike Wilson",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
    category: "Detroit Style",
    prepTime: "45 mins",
    cookTime: "15 mins",
    servings: "1 pan",
    difficulty: "Advanced",
    ingredients: [
      "500g bread flour",
      "350ml water",
      "10g instant yeast",
      "12g salt",
      "Brick cheese",
      "Pizza sauce"
    ],
    content: `
      Detroit-style pizza is characterized by its rectangular shape, crispy bottom, and caramelized cheese edges. The key is using the right pan and cheese.

      Traditional Detroit pizza uses Wisconsin brick cheese, which creates those signature crispy edges. The sauce goes on top of the cheese, creating a unique layering effect.

      The dough is high-hydration and needs to be handled carefully to achieve the right texture and rise.
    `,
    instructions: [
      "Mix dough ingredients",
      "Let rise for 2 hours",
      "Press into oiled pan",
      "Top with cheese to edges",
      "Add sauce after baking"
    ],
    tips: [
      "Use a proper steel pan",
      "Let dough come to room temp",
      "Cheese should go to edges",
      "Sauce goes on last"
    ],
    nutritionInfo: {
      calories: "350 per slice",
      protein: "12g",
      carbs: "45g",
      fat: "15g"
    }
  }
};

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link to="/" className="text-accent hover:text-highlight">Return home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <article className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-accent hover:text-highlight mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <span className="text-accent text-sm font-semibold">{article.category}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">{article.title}</h1>
          <p className="text-gray-400 mb-6">By {article.author}</p>
          
          {/* Recipe Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-secondary p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-gray-400">Prep Time</p>
                <p className="font-medium">{article.prepTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-gray-400">Cook Time</p>
                <p className="font-medium">{article.cookTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-gray-400">Servings</p>
                <p className="font-medium">{article.servings}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="font-medium">{article.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ingredients */}
          <div className="mb-8 bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {article.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-accent">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {article.instructions?.map((instruction, index) => (
                <li key={index} className="flex space-x-4">
                  <span className="text-accent font-bold">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="prose prose-invert max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {/* Pro Tips */}
          <div className="mt-12 bg-secondary rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Pro Tips</h3>
            <ul className="space-y-2">
              {article.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition Information */}
          {article.nutritionInfo && (
            <div className="mt-8 bg-secondary rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Nutrition Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400">Calories</p>
                  <p className="font-medium">{article.nutritionInfo.calories}</p>
                </div>
                <div>
                  <p className="text-gray-400">Protein</p>
                  <p className="font-medium">{article.nutritionInfo.protein}</p>
                </div>
                <div>
                  <p className="text-gray-400">Carbs</p>
                  <p className="font-medium">{article.nutritionInfo.carbs}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fat</p>
                  <p className="font-medium">{article.nutritionInfo.fat}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
