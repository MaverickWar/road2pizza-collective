import React from 'react';

const posts = [
  {
    id: 1,
    title: "Perfect Neapolitan Dough",
    author: "Maria Romano",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Technique",
  },
  {
    id: 2,
    title: "Mastering Wood-Fired Ovens",
    author: "Marco Rossi",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Equipment",
  },
  {
    id: 3,
    title: "Seasonal Toppings Guide",
    author: "Sophie Chen",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Ingredients",
  },
];

const FeaturedPosts = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-textLight mb-12">Featured Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="bg-background rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-accent text-sm font-semibold">{post.category}</span>
                <h3 className="text-xl font-bold text-textLight mt-2 mb-3">{post.title}</h3>
                <p className="text-gray-400">By {post.author}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;