# Analyze Page - Lexi Contract Copilot

The Analyze page is the core feature of Lexi, providing AI-powered contract analysis for freelancers and creators.

## Features

### 📄 Document Upload & Preview
- **Drag & Drop Support**: Upload contracts via drag and drop or file browser
- **Multiple Formats**: Supports PDF, Word documents, and text files
- **Interactive Preview**: Side-by-side layout with document on left, insights on right
- **View Modes**: Toggle between text and PDF preview modes
- **Zoom Controls**: Adjust document zoom level for better readability
- **Search**: Search within the document content

### 🤖 AI Analysis Panel
The insights panel is organized into 5 main sections:

#### 1. Summary
- Plain-language summary of the contract
- AI confidence indicator
- Key points and overview

#### 2. Key Clauses
- Ranked list of important contract clauses
- Categories: Payment, Liability, IP, Termination, Confidentiality
- Importance levels: High, Medium, Low
- Interactive highlighting in document

#### 3. Risks & Red Flags
- Highlighted risky terms with severity indicators
- Severity levels: Low, Medium, High
- Detailed risk descriptions
- Links to relevant contract sections

#### 4. Obligations & Deadlines
- Clear list of user obligations
- Deadline tracking with visual indicators
- Due date calculations
- Priority-based organization

#### 5. Negotiation Playbook
- Suggested edits and redlines
- Before/after text comparison
- Reasoning for each suggestion
- Copy-to-clipboard functionality

### 🎯 Interactive Features
- **Cross-Highlighting**: Click any insight to highlight corresponding text in document
- **Confidence Indicators**: Progress bars showing AI confidence levels
- **Export Options**: PDF, Word, and Markdown export
- **Share Functionality**: Generate shareable links
- **Re-analyze**: Re-run AI analysis on the same document

## Component Structure

```
analyze/
├── page.tsx                 # Main page component
├── layout.tsx              # Page layout
├── components/
│   ├── analyze-toolbar.tsx # Top toolbar with actions
│   ├── document-preview.tsx # Document display and interaction
│   ├── insights-panel.tsx  # Main analysis results panel
│   ├── upload-zone.tsx     # File upload interface
│   ├── summary-card.tsx    # Contract summary display
│   ├── clause-card.tsx     # Individual clause cards
│   ├── risk-card.tsx       # Risk assessment cards
│   ├── obligation-card.tsx # Obligation tracking cards
│   ├── negotiation-card.tsx # Negotiation suggestions
│   ├── loading-skeleton.tsx # Loading state
│   └── index.ts           # Component exports
└── README.md              # This file
```

## Data Models

### ContractDocument
```typescript
interface ContractDocument {
  id: string;
  name: string;
  content: string;
  type: "pdf" | "text";
  uploadedAt: Date;
}
```

### AnalysisResult
```typescript
interface AnalysisResult {
  summary: string;
  keyClauses: Clause[];
  risks: Risk[];
  obligations: Obligation[];
  negotiationSuggestions: NegotiationSuggestion[];
  confidence: number;
}
```

## Design Principles

### 🎨 Visual Design
- **Primary Color**: #6366f1 (Indigo)
- **Accent Color**: #f59e0b (Amber)
- **Consistent Hierarchy**: Clear headings, expandable sections
- **Professional UI**: Clean, modern interface using shadcn/ui components

### 📱 Responsive Design
- **Desktop**: Side-by-side layout with document and insights
- **Mobile**: Stacked layout with insights below document
- **Adaptive**: Components adjust to screen size

### ♿ Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Usage

1. **Upload Contract**: Drag and drop or browse for contract file
2. **Wait for Analysis**: AI processes the document (2-3 seconds)
3. **Review Insights**: Navigate through the 5 analysis tabs
4. **Interact**: Click insights to highlight text in document
5. **Export/Share**: Use toolbar actions to export or share results

## Future Enhancements

- Multi-document comparison
- Real-time collaboration
- Negotiation chat interface
- Contract templates
- Legal compliance checking
- Integration with e-signature platforms
