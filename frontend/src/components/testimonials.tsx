import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            What Our Community Says
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Thousands of students are already exchanging skills and growing together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <TestimonialCard
            quote="I learned Photoshop basics in just three 30-minute sessions, and in return, I taught Excel formulas. It was so much more engaging than watching tutorials!"
            author="Alice Chen"
            role="Graphic Design Student"
            avatar="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          />
          
          <TestimonialCard
            quote="As someone who works full-time, I never found time for traditional courses. SkillSwap lets me learn web development in small, manageable sessions that fit my schedule."
            author="Michael Rodriguez"
            role="Marketing Professional"
            avatar="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          />
          
          <TestimonialCard
            quote="I've taught piano for years, but never found an easy way to learn photography in return. SkillSwap connected me with the perfect learning partner within days."
            author="Emma Johnson"
            role="Music Teacher"
            avatar="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, author, role, avatar }) {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <blockquote className="flex-1">
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              "{quote}"
            </p>
          </blockquote>
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <p className="font-medium">{author}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}