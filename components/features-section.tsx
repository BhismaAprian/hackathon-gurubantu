import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BookOpen, User, GraduationCap } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Discussion Forum",
    description: "Engage with fellow learners and share knowledge through active discussion forums.",
  },
  {
    icon: BookOpen,
    title: "Digital Library",
    description: "Access thousands of learning materials, e-books, and high-quality educational resources.",
  },
  {
    icon: User,
    title: "Personal Profile",
    description: "Manage your learning progress and track achievements through a comprehensive personal dashboard.",
  },
  {
    icon: GraduationCap,
    title: "Learning Paths",
    description: "Follow structured learning paths designed by experts to achieve your educational goals.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the tools and resources that make learning effective and engaging
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
