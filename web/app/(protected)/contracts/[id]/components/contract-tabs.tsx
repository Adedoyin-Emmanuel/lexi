"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContractTabsProps {
  contract: {
    summary: string;
    risks: string[];
    keyTerms: string[];
    obligations: string[];
  };
}

export const ContractTabs = ({ contract }: ContractTabsProps) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="terms">Key Terms</TabsTrigger>
        <TabsTrigger value="risks">Risks</TabsTrigger>
        <TabsTrigger value="obligations">Obligations</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed">{contract.summary}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="terms" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {contract.keyTerms.map((term, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{term}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="risks" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {contract.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="obligations" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {contract.obligations.map((obligation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{obligation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
