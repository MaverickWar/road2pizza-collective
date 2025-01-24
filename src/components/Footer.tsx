import { memo } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">About Road 2 Pizza</h3>
            <p className="text-muted-foreground">
              Join our community of pizza enthusiasts. Share recipes, learn techniques, and master the art of pizza making.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/pizza" className="text-muted-foreground hover:text-primary transition-colors">Pizza Types</Link></li>
              <li><Link to="/reviews" className="text-muted-foreground hover:text-primary transition-colors">Reviews</Link></li>
              <li><Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/recipes" className="text-muted-foreground hover:text-primary transition-colors">Recipes</Link></li>
              <li><Link to="/equipment" className="text-muted-foreground hover:text-primary transition-colors">Equipment</Link></li>
              <li><Link to="/techniques" className="text-muted-foreground hover:text-primary transition-colors">Techniques</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground">
            © {currentYear} Road 2 Pizza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);