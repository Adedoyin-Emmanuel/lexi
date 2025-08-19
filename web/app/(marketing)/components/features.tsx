import {
  Eye,
  Brain,
  Shield,
  Target,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  color: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg group">
      <CardContent className="p-6 text-center">
        <div
          className={`w-12 h-12 ${color} !rounded-[6px] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-primary" />,
      title: "Smart Contract Detection",
      description:
        "Automatically detects contract types (NDA, Independent Contractor Agreement, License Agreement) and provides specialized analysis for each type.",
      color: "bg-primary/10",
    },
    {
      icon: <LinkIcon className="w-6 h-6 text-secondary" />,
      title: "Span-Linked Highlights",
      description:
        "Every explanation is directly linked to the contract text with confidence scores and flags for uncertainty. Trust what you're reading.",
      color: "bg-secondary/10",
    },
    {
      icon: <Calendar className="w-6 h-6 text-accent" />,
      title: "Actionable Timeline",
      description:
        "Obligations turn into actionable events with clear deadlines and important dates. Know what you need to track and when.",
      color: "bg-accent/10",
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Mini Negotiation Playbook",
      description:
        "Get AI-powered redlines and negotiation suggestions. Replace problematic clauses with industry-standard alternatives that protect your interests.",
      color: "bg-primary/10",
    },
    {
      icon: <Eye className="w-6 h-6 text-secondary" />,
      title: "Privacy First",
      description:
        "We don't store your contracts. Your sensitive legal documents stay private and secure. Process locally or with enterprise-grade encryption.",
      color: "bg-secondary/10",
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: "Confidence Scoring",
      description:
        "Every analysis comes with confidence scores and abstain logic. Know when the AI is certain vs. when you should seek legal counsel.",
      color: "bg-accent/10",
    },
  ];

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Built for Freelancers &{" "}
            <span className="block text-primary">Creators</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop struggling with complex legal jargon. Lexi brings
            enterprise-grade contract analysis to freelancers and creators with
            an intuitive interface that actually makes sense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
