import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="font-bold text-xl">SkillSwap</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Exchange knowledge, grow together. Connect with peers to swap skills through micro-learning sessions.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Platform</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Skills</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Resources</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community Forums</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Learning Resources</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Company</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} SkillSwap. All rights reserved.
        </p>
      </div>
    </footer>
  );
}