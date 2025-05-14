
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "GameAtlas helped us find communities we never knew existed for our game. Our wishlists doubled in the first month!",
    author: "Sarah Chen",
    role: "Solo Developer, Pixel Dreams Studio",
    game: "Starlight Wanderer"
  },
  {
    quote: "As a small team, we couldn't afford big marketing campaigns. GameAtlas allowed us to reach exactly the right people at a fraction of the cost.",
    author: "Miguel Rodriguez",
    role: "Lead Designer, Novacraft Games",
    game: "Dungeon Echoes"
  },
  {
    quote: "The creator match engine alone saved us weeks of research. We connected with YouTubers who were genuinely excited about our game.",
    author: "Alex Taylor",
    role: "Marketing Director, Horizon Interactive",
    game: "Outland Chronicles"
  }
];

const Testimonial = () => {
  return (
    <section className="py-20 bg-atlas-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Game Developers Say</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            GameAtlas has helped indie developers across the world connect with their perfect audience.
          </p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="px-4">
                <div className="bg-atlas-purple bg-opacity-10 border border-atlas-purple border-opacity-20 rounded-2xl p-8 text-center">
                  <blockquote className="text-xl md:text-2xl italic mb-6">"{testimonial.quote}"</blockquote>
                  <div className="font-semibold text-lg">{testimonial.author}</div>
                  <div className="text-atlas-teal">{testimonial.role}</div>
                  <div className="text-gray-400 text-sm mt-1">Developer of {testimonial.game}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex justify-center mt-8">
            <CarouselPrevious className="mr-2 bg-atlas-purple text-white border-none hover:bg-atlas-purple hover:opacity-80" />
            <CarouselNext className="ml-2 bg-atlas-purple text-white border-none hover:bg-atlas-purple hover:opacity-80" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonial;
