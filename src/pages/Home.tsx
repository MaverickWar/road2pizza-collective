import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
      </main>
    </div>
  );
}