import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const faqs = [
    {
      question: "What types of contracts can Lexi analyze?",
      answer:
        "Lexi can analyze a wide range of contracts including NDAs, Independent Contractor Agreements, License Agreements, and Service Agreements. Our AI is trained to detect contract types automatically and provide specialized analysis for each category.",
    },
    {
      question: "How accurate is Lexi's contract analysis?",
      answer:
        "Lexi provides confidence scores for every analysis, so you know when the AI is certain vs when you should seek legal counsel. We use abstain logic to avoid making uncertain claims, ensuring you get reliable information you can trust.",
    },
    {
      question: "Is my contract data secure and private?",
      answer:
        "Absolutely. We don't store your contracts. Your sensitive legal documents stay private and secure. You can process contracts locally or with enterprise-grade encryption. Your privacy is our top priority.",
    },
    {
      question: "How does the span-linked highlighting work?",
      answer:
        "Every explanation in Lexi is directly linked to specific parts of your contract text. When you see an analysis, you can click to see exactly which clauses it's referring to, along with confidence scores and flags for any uncertainty.",
    },
    {
      question: "Can Lexi help with contract negotiations?",
      answer:
        "Yes! Lexi provides a mini negotiation playbook with AI-powered redlines and negotiation suggestions. It can identify problematic clauses and suggest industry-standard alternatives that better protect your interests.",
    },
    {
      question: "What's included in the actionable timeline feature?",
      answer:
        "Lexi converts contract obligations into actionable events with clear deadlines and important dates. You'll know exactly what you need to track and when, so nothing falls through the cracks.",
    },
    {
      question: "Do I need legal knowledge to use Lexi?",
      answer:
        "No! Lexi is designed specifically for freelancers and creators who aren't legal experts. We translate complex legal jargon into plain English and provide clear, actionable insights that anyone can understand.",
    },
    {
      question: "How does Lexi compare to hiring a lawyer?",
      answer:
        "Lexi is a powerful tool for initial contract review and understanding, but it's not a replacement for legal counsel. We recommend using Lexi to get familiar with your contracts, then consulting a lawyer for complex negotiations or high-stakes agreements.",
    },
  ];

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10" />
      <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Frequently Asked{" "}
            <span className="block text-primary">Questions</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about Lexi and how it can help you
            understand and negotiate your contracts with confidence.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-[17px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[17px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
