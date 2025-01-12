import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, ThumbsUp, ThumbsDown, Clock, User, Award } from 'lucide-react';

const ProductReviewDashboard = () => {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetching featured reviews
        const { data: featured, error: featuredError } = await supabase
          .from('equipment_reviews')
          .select('*')
          .eq('featured', true)
          .limit(4); // Adjust limit as needed
        if (featuredError) throw featuredError;

        // Fetching latest reviews
        const { data: latest, error: latestError } = await supabase
          .from('equipment_reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        if (latestError) throw latestError;

        setFeaturedReviews(featured);
        setLatestReviews(latest);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold text-orange-800">Ultimate Pizza Oven Reviews</h1>
        <p className="text-xl text-orange-600">Your guide to the perfect home-made Neapolitan pizza</p>
      </div>

      {/* Featured Reviews */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-orange-800">Featured Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden border-orange-200 hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={review.image_url || '/api/placeholder/600/400'}
                  alt={review.title}
                  className="w-full h-64 object-cover"
                />
                {review.editor_choice && (
                  <Badge className="absolute top-4 left-4 bg-orange-600">
                    <Award className="w-4 h-4 mr-1" /> Editor's Choice
                  </Badge>
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">{review.category}</Badge>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-bold">{review.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-900">{review.title}</h3>
                  <p className="text-lg font-semibold text-orange-600">{review.price}</p>
                </div>
                <p className="text-gray-600">{review.snippet}</p>
                <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                  <div className="flex items-center text-sm text-orange-700">
                    <User className="w-4 h-4 mr-1" />
                    {review.author}
                    <Clock className="w-4 h-4 ml-4 mr-1" />
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Read Full Review
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Latest Reviews */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-orange-800">Latest Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden border-orange-200 hover:shadow-lg transition-shadow">
              <img
                src={review.image_url || '/api/placeholder/300/200'}
                alt={review.title}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4 space-y-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">{review.category}</Badge>
                <h3 className="font-bold text-orange-900">{review.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-orange-600">{review.price}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-bold">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.snippet}</p>
                <Button variant="ghost" className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                  Read More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewDashboard;
