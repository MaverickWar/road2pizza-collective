import { Link } from 'react-router-dom';
import { Pizza } from 'lucide-react';

const MainNav = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pizza", label: "Pizza" },
    { href: "/community", label: "Community" },
    { href: "/reviews", label: "Reviews" },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-transparent border-2 border-accent rounded-full flex items-center justify-center">
              <Pizza className="w-6 h-6 text-accent" />
            </div>
            <span className="text-accent font-light text-xl tracking-wider hover:text-accent/80 transition-colors">
              Road2Pizza
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-textLight hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;