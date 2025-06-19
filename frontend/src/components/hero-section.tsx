import Link from 'next/link';
import { Button } from './ui/button';

export function HeroSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 sm:h-80 md:h-96 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>
      
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Share what you know,<br />
              <span className="text-primary">Learn what you don't</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Exchange micro-learning sessions with peers. Teach your expertise, learn new skills, 
              no money needed — just your time and knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-6 font-medium">
                  Start Swapping
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto scroll-smooth">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6 font-medium">
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50607 9.31161C2.52216 10.2808 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7192 4.17891 9.97739C4.94754 9.22098 6.09544 8.87499 7.49998 8.87499C8.90453 8.87499 10.0524 9.22098 10.8211 9.97739C11.5721 10.7192 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4779 10.2808 11.4939 9.31161C10.7244 8.55134 9.70025 8.12901 8.50625 7.98351C10.0187 7.54738 11.125 6.15288 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
              <span>Join 10,000+ users already swapping skills</span>
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-gradient-to-tr from-primary/80 to-primary p-1 rounded-2xl rotate-1 shadow-xl">
              <div className="bg-card rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/9]">
                <img 
                  src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
            
            {/* Floating skill cards */}
            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-card p-3 sm:p-4 rounded-lg shadow-lg border animate-bounce-slow hidden sm:block">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video">
                    <path d="m22 8-6 4 6 4V8Z"/>
                    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Video Editing</p>
                  <p className="text-xs text-muted-foreground">Taught by Alice</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-card p-3 sm:p-4 rounded-lg shadow-lg border animate-bounce-slow hidden sm:block">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-2">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Excel Mastery</p>
                  <p className="text-xs text-muted-foreground">Taught by Bob</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}