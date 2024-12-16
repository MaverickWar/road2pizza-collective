import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const articles = {
  1: {
    title: "Perfect Neapolitan Dough",
    author: "Maria Romano",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Technique",
    content: `
      The art of making Neapolitan pizza dough is a time-honored tradition that requires patience, precision, and understanding. The perfect dough begins with just four ingredients: flour, water, salt, and yeast. However, it's the technique and timing that transforms these simple ingredients into the characteristic light, airy, and chewy crust that defines Neapolitan pizza.

      Start with high-quality 00 flour, which has a fine texture and the right protein content. The hydration level should be around 60-65%, creating a dough that's workable yet wet enough to develop proper gluten structure. Allow for a long, slow fermentation at room temperature (about 8-12 hours) followed by ball-forming and a second rise.

      The key to success lies in maintaining the right temperature throughout the process and handling the dough with respect and care. Remember, great pizza dough is born from both technique and patience.
    `,
    tips: [
      "Use 00 flour for authentic texture",
      "Keep water temperature at 65°F (18°C)",
      "Allow for proper fermentation time",
      "Handle dough gently to preserve air bubbles"
    ]
  },
  2: {
    title: "Mastering Wood-Fired Ovens",
    author: "Marco Rossi",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Equipment",
    content: `
      Wood-fired ovens are the heart of traditional pizza making. These ovens can reach temperatures of up to 900°F (482°C), cooking a pizza to perfection in just 60-90 seconds. The combination of intense heat and wood smoke creates the distinctive char and flavor that defines authentic Neapolitan pizza.

      Managing a wood-fired oven requires skill and experience. The fire must be built and maintained properly to achieve the right temperature distribution. The dome of the oven should be white-hot, while the floor maintains a slightly lower temperature to prevent burning the bottom of the pizza.

      Understanding how to read the oven's temperature and manage the fire is crucial for consistent results. Each type of wood brings its own character to the cooking process, with hardwoods like oak and maple being preferred for their long, steady burn and subtle flavor contribution.
    `,
    tips: [
      "Start the fire 2-3 hours before cooking",
      "Use well-seasoned hardwood",
      "Maintain dome temperature around 850-900°F",
      "Rotate pizzas for even cooking"
    ]
  },
  3: {
    title: "Seasonal Toppings Guide",
    author: "Sophie Chen",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Ingredients",
    content: `
      The best pizzas are made with seasonal ingredients that are at their peak of flavor. Each season brings its own unique combinations and possibilities. Spring offers tender vegetables like asparagus and peas, while summer brings an abundance of tomatoes, basil, and zucchini.

      Fall is perfect for mushrooms, squash, and sage, creating hearty, satisfying combinations. Winter calls for preserved ingredients and hardy vegetables like kale and Brussels sprouts. Understanding seasonality not only ensures the best flavor but also supports sustainable cooking practices.

      Remember that less is more when it comes to toppings. Choose ingredients that complement each other and don't overwhelm the delicate balance of the pizza. Quality always trumps quantity.
    `,
    tips: [
      "Use ingredients at their seasonal peak",
      "Balance flavors and textures",
      "Don't overload the pizza",
      "Consider pre-cooking certain vegetables"
    ]
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
          
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-invert max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </div>

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
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;