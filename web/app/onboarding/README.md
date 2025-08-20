# Multi-Step Onboarding Flow

A comprehensive, animated onboarding flow built with Next.js, React, and shadcn/ui components.

## Features

- **5-Step Process**: Basic info, role selection, niche selection, profile picture, and confirmation
- **Smooth Animations**: GSAP-powered transitions between steps
- **Progress Tracking**: Visual progress bar with step indicators
- **Responsive Design**: Works seamlessly on desktop and mobile
- **State Management**: React Context for persistent data across steps
- **Modern UI**: Built with shadcn/ui components for consistency

## Components

### Core Components

- `Onboarding` - Main component that orchestrates the entire flow
- `OnboardingProvider` - Context provider for state management
- `OnboardingProgressBar` - Progress indicator with step navigation

### Step Components

- `StepBasicInfo` - Name and email collection
- `StepRoleSelection` - Freelancer vs Creator selection
- `StepNicheSelection` - Industry/niche selection with multiple choice
- `StepProfilePicture` - Drag & drop image upload
- `StepConfirmation` - Review and final confirmation
- `OnboardingSuccess` - Completion screen

## Usage

```tsx
import { Onboarding } from "./components/onboarding";

export default function OnboardingPage() {
  return <Onboarding />;
}
```

## State Management

The onboarding uses React Context to manage state across all steps:

```tsx
interface OnboardingData {
  name: string;
  email: string;
  role: "freelancer" | "creator" | "";
  niche: string[];
  profilePicture: File | null;
  agreedToTerms: boolean;
}
```

## Animations

GSAP animations are used for:

- Step transitions (fade in/out with scale)
- Progress bar updates
- Step indicator highlights

## Customization

### Adding New Steps

1. Create a new step component
2. Add it to the `stepComponents` array in `onboarding.tsx`
3. Update the `OnboardingData` interface if needed
4. Add step metadata to the progress bar

### Styling

All components use Tailwind CSS classes and shadcn/ui components for consistent styling. The design is responsive and follows modern UI patterns.

### Data Submission

The `handleComplete` function in `StepConfirmation` is where you would typically submit the collected data to your backend API.

## File Structure

```
components/
├── onboarding.tsx              # Main orchestrator
├── onboarding-context.tsx      # State management
├── progress-bar.tsx            # Progress indicator
├── step-basic-info.tsx         # Step 1
├── step-role-selection.tsx     # Step 2
├── step-niche-selection.tsx    # Step 3
├── step-profile-picture.tsx    # Step 4
├── step-confirmation.tsx       # Step 5
├── onboarding-success.tsx      # Success screen
└── index.ts                    # Exports
```

## Dependencies

- Next.js 15
- React 19
- GSAP 3.13.0
- shadcn/ui components
- Tailwind CSS
- Lucide React icons
