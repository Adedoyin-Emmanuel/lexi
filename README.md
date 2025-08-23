# Lexi

## Understand your contracts in plain English. Built for freelancers and creators

> Built From Scratch with ❤️ by [me](https://github.com/Adedoyin-Emmanuel) | [Video Demo](https://youtube.com/@Adedoyin-Emma) | [My Hackathon Experience](https://adedoyin.hashnode.dev/my-experience-at-the-co-creating-with-gpt-5-hackathon-by-aimlapi) | [Presentation Slide](https://docs.google.com) | [Social Media Development Journey Post](https://x.com/Emmysoft_Tm/status/1958116799414747566)

Lexi helps freelancers and creators understand contracts by detecting contract types, highlighting key clauses with confidence scores, and turning obligations into clear, actionable timelines.

![Main screenshot](./screenshots/screenshot-1.png)

## Built With

Lexi was built from scratch with the following technologies:

- [AIML API](https://aimlapi.com/models/gpt-5) (GPT-5 ◊and other models)
- [Mongo DB](https://mongodb.com) (Database)
- [Redis](https://redis.io) (Caching)
- [React](https://reactjs.org)
- [NextJs](https://nextjs.org)
- [Nodejs](https://nodejs.org/en/)
- [TypeScript](https://typescriptlang.org)
- [Typegoose](https://typegoose.github.io/typegoose/)
- [Tailwindcss](https://tailwindcss.com/)
- [ShadcnUI](https://ui.shadcn.com) (Component library)
- [BullMQ](https://bullmq.io/) (Background jobs)

## Getting Started

Visit to [uselexi.xyz](https://uselexi.xyz) to get started.

## Setting up the project locally

## Prerequisites

- Nodejs (v18 or higher) [install](https://nodejs.org/en/download/)
- Mongodb [install](https://www.mongodb.com/try/download/compass)
- Redis (for caching) [install](https://redis.io/download) or [brew (macos)](https://formulae.brew.sh/formula/redis)
- AI/AL Account [create](https://aimlapi.com/app/sign-in)

## Installation

### API (SERVER)

```bash
git clone https://github.com/Adedoyin-Emmanuel/lexi.git
```

2. Install dependencies

```bash
# npm
cd lexi && npm install

# yarn
cd lexi && yarn
```

3. Create a `.env` file in the root directory and add all the environment variables in the `.env.example` file. Update the values accordingly.
4. Start the API.

```bash
# npm
npm run dev

# yarn
yarn dev
```

This should start the API on `http://localhost:2800` successfully.

#### Trying the Analyze Contract Feature

The core of the app (contract analyzer) is powered by **AI/ML API**, to try it out, you will need to do the following:

- Create an account with them [here](https://aimlapi.com/app/sign-in)
- Verify your account by adding your card.
- Get a paid plan (Startup plan, pass as you go) [here](https://aimlapi.com/ai-ml-api-pricing)
- Purchase plan and create an API KEY [here](https://aimlapi.com/app/keys)
- Update the `.env` file.
- And that's it, you're all set.

### Web Client

1. Install dependencies

```bash
# npm
cd web && npm install

# yarn
cd web && yarn
```

2. Start the APP

```bash
# npm
npm run dev

# yarn
yarn dev
```

It should start the web app on `http://localhost:3000` successfully.

## Disclaimer

Considering the fact that this project was built within a very short period of time (5 days to be precise), the app might contain some bugs. I will be working on refactoring, fixing or adding more features in the future **(if time permits)**.

Also, response from production instance might be slow, considering it was hosted on a cheap sever Railway Hobby Plan($5 of monthly usage).


[**First Commit**](https://github.com/Adedoyin-Emmanuel/lexi/commit/49f50796793f754e3aa31eb9324ffeb300dfb3e0)