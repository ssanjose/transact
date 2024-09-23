# Implementation
## Database
### Account Table
  - Creates different types of Account (Spending, Chequing, etc.)

### Asset Table
  - Recorded Transactions for Accounts

### AccountChanges Table
  - Change of amount of Accounts
  - Connects Accounts and Transactions

### Category Table
  - Category of Transaction (Asset object)

## Time Sequence Array 
  - Calculates total change over duration of month.
  - Array of AccountChanges
  - Sorted with binary search
  - Stack

