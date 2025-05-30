import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Welcome to <span className="text-primary">LearnHub</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            An integrated learning platform with discussion forums and digital library to support your educational
            journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              Start Learning
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3">
              Explore Library
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
