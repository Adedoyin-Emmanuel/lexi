"use client";

import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg group">
      <CardContent className="p-6 text-center">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
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
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "30-Second Risk Analysis",
      description:
        "Upload any contract and get instant risk assessment with severity scoring (1-5). GPT-5 identifies 94% of known contract risks.",
      color: "bg-primary/10",
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-secondary" />,
      title: "Hidden Legal Traps",
      description:
        "AI spots dangerous clauses, hidden fees, and legal traps that human reviewers miss 80% of the time. Everyone has signed contracts they didn't fully understand.",
      color: "bg-secondary/10",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-accent" />,
      title: "Professional Reports",
      description:
        "Executive summary, clause-by-clause breakdown, and risk mitigation recommendations. Downloadable PDF reports ready for legal review.",
      color: "bg-accent/10",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "GPT-5 Legal Reasoning",
      description:
        "GPT-5's deep reasoning handles complex legal language and multi-clause interactions that smaller models miss. Superior to traditional legal analysis.",
      color: "bg-primary/10",
    },
    {
      icon: <Zap className="w-6 h-6 text-secondary" />,
      title: "Enterprise Ready",
      description:
        "Targeting $10B+ legal tech market. Ready for enterprise deployment with SOC 2 compliance and on-premise options.",
      color: "bg-secondary/10",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-accent" />,
      title: "Smart Clause Suggestions",
      description:
        "Get AI-powered recommendations for better contract terms. Replace problematic clauses with industry-standard alternatives that protect your interests.",
      color: "bg-accent/10",
    },
  ];

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Everything You Need to
            <span className="block text-primary">Master Your Contracts</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop struggling with complex legal tools designed for law firms.
            Lexi brings enterprise-grade contract analysis to everyone with an
            intuitive interface that actually makes sense.
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
