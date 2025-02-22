
import React, { useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface PizzaType {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  slug: string;
  display_order: number;
  is_hidden: boolean;
}

const PizzaTypeGrid = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { data: pizzaTypes, isLoading, error } = useQuery({
    queryKey: ['pizzaTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      return data as PizzaType[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up', 'opacity-100');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    itemsRef.current.forEach((item) => {
      if (item) {
        observerRef.current?.observe(item);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [pizzaTypes]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading pizza types",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pizzaTypes?.map((pizzaType, index) => (
        <div
          key={pizzaType.id}
          ref={(el) => (itemsRef.current[index] = el)}
          className="opacity-0 transform translate-y-4"
          style={{ 
            transitionDelay: `${index * 100}ms`,
            transitionDuration: '500ms',
            transitionProperty: 'all'
          }}
        >
          <Link
            to={`/pizza/${pizzaType.slug}`}
            className="block relative overflow-hidden rounded-lg aspect-square hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="relative w-full h-full bg-secondary/10">
              {/* Blur thumbnail while loading */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
                style={{
                  backgroundImage: `url(${pizzaType.image_url || '/placeholder.svg'})`,
                }}
              />
              
              {/* Main image */}
              <img
                src={pizzaType.image_url || '/placeholder.svg'}
                alt={pizzaType.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '1';
                  target.previousElementSibling?.remove(); // Remove blur thumbnail
                }}
                style={{ opacity: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-2">{pizzaType.name}</h3>
                <p className="text-sm text-gray-200">{pizzaType.description || 'No description available'}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PizzaTypeGrid;
