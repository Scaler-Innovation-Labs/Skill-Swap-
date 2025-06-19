import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Ready to exchange skills and expand your horizons?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of students and professionals who are already growing through collaborative learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-60 lg:h-auto overflow-hidden rounded-b-lg lg:rounded-l-none lg:rounded-r-lg">
                <img 
                  src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Students collaborating" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            number="10,000+"
            label="Active Users"
            description="Students and professionals using SkillSwap daily."
          />
          
          <StatCard 
            number="25,000+"
            label="Skills Exchanged"
            description="Learning sessions completed on our platform."
          />
          
          <StatCard 
            number="200+"
            label="Different Skills"
            description="From programming to painting, Excel to electronics."
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ number, label, description }) {
  return (
    <div className="text-center p-6 bg-card rounded-xl border shadow-sm">
      <p className="text-4xl font-bold text-primary mb-2">{number}</p>
      <p className="text-xl font-medium mb-2">{label}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}