"use client";

import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Download,
  Share2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularConfidence } from "../../components/circular-confidence";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock data - replace with actual API call
const mockContract = {
  id: "1",
  name: "Employment Agreement - John Smith",
  uploadedAt: "2024-01-15",
  confidenceScore: 85,
  status: "Safe" as const,
  riskType: "Low" as const,
  contractType: "Employment",
  parties: ["John Smith", "TechCorp Inc"],
  startDate: "2024-01-15",
  endDate: "2025-01-15",
  value: "$75,000",
  summary:
    "This employment agreement outlines the terms and conditions for John Smith's employment as a Senior Software Engineer at TechCorp Inc. The contract includes standard employment terms, benefits, and termination clauses.",
  keyTerms: [
    "Position: Senior Software Engineer",
    "Salary: $75,000 annually",
    "Benefits: Health insurance, 401k, PTO",
    "Term: 1 year with renewal option",
    "Termination: 30 days notice required",
  ],
  risks: [
    "Non-compete clause may be overly restrictive",
    "Intellectual property assignment is standard",
    "Termination clause is reasonable",
  ],
  obligations: [
    "Employee must maintain confidentiality",
    "Company must provide benefits as outlined",
    "Both parties must give 30 days notice for termination",
  ],
};

const ContractDetail = () => {
  const params = useParams();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "Hello! I'm here to help you understand this contract. What would you like to know?",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Risky":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Needs Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getRiskTypeColor = (riskType: string) => {
    switch (riskType) {
      case "Low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user" as const,
      message: chatMessage,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: "bot" as const,
        message:
          "I understand you're asking about this contract. Let me analyze the relevant sections and provide you with a detailed explanation...",
      };
      setChatHistory((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contracts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contracts
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mockContract.name}
            </h1>
            <p className="text-muted-foreground">Contract Details & Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contract Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Parties
                  </label>
                  <p className="text-sm">{mockContract.parties.join(" & ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Contract Type
                  </label>
                  <p className="text-sm">{mockContract.contractType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>
                  <p className="text-sm">{mockContract.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    End Date
                  </label>
                  <p className="text-sm">{mockContract.endDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Contract Value
                  </label>
                  <p className="text-sm">{mockContract.value}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Uploaded
                  </label>
                  <p className="text-sm">{mockContract.uploadedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Details */}
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
                  <p className="text-sm leading-relaxed">
                    {mockContract.summary}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {mockContract.keyTerms.map((term, index) => (
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
                    {mockContract.risks.map((risk, index) => (
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
                    {mockContract.obligations.map((obligation, index) => (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contract Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence Score</span>
                <CircularConfidence
                  score={mockContract.confidenceScore}
                  size={48}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(mockContract.status)}>
                    {mockContract.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Risk Level
                  </span>
                  <Badge className={getRiskTypeColor(mockContract.riskType)}>
                    {mockContract.riskType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Widget */}
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contract Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-3">
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this contract..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
