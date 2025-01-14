# Finance Tracker App

The Finance Tracker App is an application designed to help users track their expenses, income, and overall financial status. It provides a convenient way to categorize and visualize financial data through graphs.

![Landing Page](/public/transact_landing.jpg)

With this app, users can record their expenses and income, assigning them to specific categories such as groceries, transportation, entertainment, or any other custom categories they define. By categorizing their transactions, users can gain insights into their spending habits and identify areas where they can potentially save money.

In addition to tracking individual expenses and income, the app also calculates the net amount, which represents the difference between the total income and total expenses. This allows users to see their overall financial status at a glance.

One of the key features of the Finance Tracker App is its ability to generate graphs and charts based on the recorded data. These visual representations provide a clear overview of the user's financial situation over time. Users can choose different types of graphs, such as bar charts or pie charts, to visualize their expenses and income in a way that is easy to understand.

By using the Finance Tracker App, users can gain better control over their finances, make informed decisions about their spending, and work towards achieving their financial goals.

The Finance Tracker App lists your income and expenses and posts them as a graph and informatics.

## Goal


## Directory Structure for Important Files
```
finance-tracker-app/
├── docs/
│   ├── design/
│   │   └── software_design.md
│   ├── architecture/
│   │   └── system_architecture.md
│   ├── conventions/
│   │   └── coding_conventions.md
│   └── style/
│       └── style_guide.md
├── ERD_and_Implementation/
│   ├── Plan.erd
│   ├── Requirements.todo
│   └── Typing&Validation.todo
├── src/
│   ├── app/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── README.md
└── ...
```

## Documentation

- [Software Design](./docs/design/software_design.md)
- [System Architecture](./docs/architecture/system_architecture.md)
- [Coding Conventions](./docs/conventions/coding_conventions.md)
- [Style Guide](./docs/style/style_guide.md)

## Core Process
### Account, Input, Output
#### Accounts
Places for income to be stored.
#### Input
Takes in amounts labeled as either income, savings, or expense, along with its frequency. User can declare if expense is non-essential.

'Income' are sent into accounts. 'Expenses' subtract from accounts. 
#### Output
**Compile** income, savings, and expense. Turn income, saving, and expense account into a csv and reset 'Income' and 'Expense' accounts. 'Saving' accounts will remain for the next iteration.

Charts income and usage, either arranged by name or category.

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment (Coming Soon)
Soon to be deployed with GitHub pages