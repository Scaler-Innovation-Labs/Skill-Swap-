export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 scroll-mt-16">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How SkillSwap Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Exchange skills in just a few simple steps. No complicated setup, no financial barriers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-primary/20 z-0" />
          
          <StepCard
            number="1"
            title="Create Your Profile"
            description="Add skills you can teach and skills you want to learn. The more specific, the better your matches will be."
          />
          
          <StepCard
            number="2"
            title="Find Matches"
            description="Our system will suggest users with complementary skill sets. Browse profiles and request skill exchanges."
          />
          
          <StepCard
            number="3"
            title="Schedule Sessions"
            description="Agree on a time for your micro-learning sessions. Sessions can be as short as 15 minutes or up to an hour."
          />
          
          <StepCard
            number="4"
            title="Learn & Teach"
            description="Connect via our integrated video platform, exchange knowledge, and provide feedback after each session."
          />
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg mb-6">
            Ready to start swapping skills with peers around the world?
          </p>
          <a 
            href="/signup" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Join SkillSwap Today
          </a>
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg mb-4">
        {number}
      </div>
      <div className="bg-card p-6 rounded-xl border shadow-sm w-full">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}