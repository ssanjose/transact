type BaseDateProps = {
  year?: string,
  month?: string,
  date?: string,
}

// ------------------- TransactionProps -------------------
type TransactionNumberProps = BaseDateProps & {
  transactions: number,
}

type IncomeAndExpenseTransactionNumberProps = BaseDateProps & {
  incomeTransactions: number,
  expenseTransactions: number,
}

type TransactionAmountProps = BaseDateProps & {
  amount: number,
}

type IncomeAndExpenseTransactionAmountProps = BaseDateProps & {
  incomeAmount: number,
  expenseAmount: number,
}

export {
  type TransactionNumberProps,
  type IncomeAndExpenseTransactionNumberProps,
  type TransactionAmountProps,
  type IncomeAndExpenseTransactionAmountProps,
}