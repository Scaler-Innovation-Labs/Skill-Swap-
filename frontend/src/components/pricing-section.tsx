import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-muted/5 scroll-mt-16">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Start free, upgrade when you need more power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PlanCard title="Free" price="0" features={["5 swaps / month", "Basic video", "Community access"]} />
          <PlanCard featured title="Pro" price="9.99" features={["Unlimited swaps", "HD video", "Priority matching", "Verified badge"]} />
          <PlanCard title="Teams" price="49.99" features={["All Pro features", "Team dashboard", "Analytics"]} cta="Contact" />
        </div>
      </div>
    </section>
  );
}

function PlanCard({ title, price, features, featured = false, cta = "Get Started" }: { title: string; price: string; features: string[]; featured?: boolean; cta?: string; }) {
  return (
    <div className={`relative rounded-xl border p-6 bg-card shadow-sm ${featured ? "border-primary" : ""}`}>      
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow">Most Popular</span>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="text-4xl font-bold mb-6">
        {price === "0" ? "Free" : `$${price}`} {price !== "0" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
      </div>
      <ul className="space-y-3 mb-6 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted-foreground">
            <Check className="h-4 w-4 text-primary" /> {f}
          </li>
        ))}
      </ul>
      <Link href="/signup" className="w-full">
        <Button variant={featured ? "default" : "outline"} className="w-full">{cta}</Button>
      </Link>
    </div>
  );
} 