import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Start for free, upgrade when you need more features
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="relative">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">$0</div>
            <ul className="space-y-3 mb-6">
              <ListItem>Up to 5 skill exchanges per month</ListItem>
              <ListItem>Basic video calls</ListItem>
              <ListItem>Community forum access</ListItem>
              <ListItem>Basic profile features</ListItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="relative border-primary">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For active skill swappers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">$9.99<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <ListItem>Unlimited skill exchanges</ListItem>
              <ListItem>HD video calls</ListItem>
              <ListItem>Screen sharing</ListItem>
              <ListItem>Advanced matching algorithm</ListItem>
              <ListItem>Priority support</ListItem>
              <ListItem>Verified profile badge</ListItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button className="w-full" variant="default">Start Free Trial</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle>Teams</CardTitle>
            <CardDescription>For organizations and groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">$49.99<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <ListItem>All Pro features</ListItem>
              <ListItem>Team management dashboard</ListItem>
              <ListItem>Custom branding</ListItem>
              <ListItem>Analytics and reporting</ListItem>
              <ListItem>Dedicated account manager</ListItem>
              <ListItem>API access</ListItem>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/contact" className="w-full">
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FaqItem
            question="How does the free plan work?"
            answer="The free plan allows you to participate in up to 5 skill exchange sessions per month. You can teach or learn any skills available on the platform, with basic video call functionality."
          />
          <FaqItem
            question="Can I upgrade or downgrade at any time?"
            answer="Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle."
          />
          <FaqItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For Team plans, we also support wire transfers and purchase orders."
          />
          <FaqItem
            question="Is there a long-term contract?"
            answer="No, all our plans are month-to-month with no long-term commitment required. You can cancel at any time without penalty."
          />
        </div>
      </div>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary" />
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}