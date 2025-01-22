import { Hero } from "@/components/ui/hero-with-image-text-and-two-buttons";

function HeroDemo() {
  return (
    <div className="block">
      <Hero 
        title="This is the start of something!"
        description="Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever."
        image="/placeholder.svg"
      />
    </div>
  );
}

export { HeroDemo };