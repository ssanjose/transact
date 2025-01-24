# Data Design for Visualizations

## Overview
This document outlines the data design choices made for the visualizations in the Transact App. The data is structured to be easily imported into popular data visualization tools such as Tableau, Power BI, and Google Data Studio.

## Data Sources
The primary data sources for visualizations are:
- Accounts
- Transactions
- Categories

## Data Structure

### Accounts
The `Account` data structure represents the financial accounts in the app.

| Field          | Type   | Description                        |
|----------------|--------|------------------------------------|
| id             | number | Unique identifier for the account  |
| name           | string | Name of the account                |
| startingBalance| number | Initial balance of the account     |
| createdAt      | Date   | Date when the account was created  |
| updatedAt      | Date   | Date when the account was last updated |

### Transactions
The `Transaction` data structure represents the financial transactions in the app.

| Field          | Type          | Description                                      |
|----------------|---------------|--------------------------------------------------|
| id             | number        | Unique identifier for the transaction            |
| name           | string        | Name or description of the transaction           |
| amount         | number        | Amount of the transaction                        |
| date           | Date          | Date of the transaction                          |
| type           | TransactionType | Type of the transaction (0 = expense, 1 = income) |
| frequency      | Frequency     | Frequency of the transaction (0 = one-time, 1 = daily, 2 = weekly, 3 = monthly) |
| accountId      | number        | Foreign key to the account                       |
| categoryId     | number        | Foreign key to the category                      |
| transactionId  | number        | Foreign key to the parent transaction (if any)   |

### Categories
The `Category` data structure represents the categories for transactions.

| Field          | Type   | Description                        |
|----------------|--------|------------------------------------|
| id             | number | Unique identifier for the category |
| name           | string | Name of the category               |
| color          | string | Color associated with the category |

## Data Relationships
The data relationships are defined as follows:
- Each `Account` can have multiple `Transactions`.
- Each `Transaction` can belong to one `Account`.
- Each `Transaction` can belong to one `Category`.
- Each `Transaction` can have multiple child transactions (recurring transactions).

## Data Export
The data can be exported in the following formats for use in data visualization tools:
- CSV
- JSON
- Excel

### Example CSV Export

#### Accounts
```csv
id,name,startingBalance,createdAt,updatedAt
1,Checking Account,1000.00,2023-01-01,2023-01-10
2,Savings Account,5000.00,2023-01-01,2023-01-10
```

#### Transactions
```
id,name,amount,date,type,frequency,accountId,categoryId,transactionId
1,Grocery Shopping,50.00,2023-01-05,0,0,1,1,
2,Salary,2000.00,2023-01-01,1,0,1,2,
3,Electricity Bill,100.00,2023-01-10,0,0,1,3,
```

#### Categories
```
id,name,color
1,Groceries,#FF0000
2,Income,#00FF00
3,Utilities,#0000FF
```

## Data Visualization
The structured data can be imported into popular data visualization tools to create various visualizations such as:

- Bar charts for income and expenses by category
- Line charts for account balances over time
- Pie charts for expense distribution by category

