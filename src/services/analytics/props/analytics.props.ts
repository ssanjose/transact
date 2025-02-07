type BaseDateProps = {
  year?: string,
  month?: string,
  date?: string,
}

// ------------------- TransactionProps -------------------
type TransactionNumberProps = BaseDateProps & {
  transactions: number,
}

type IncomeExpenseTransactionNumberProps = BaseDateProps & {
  incomeTransactions: number,
  expenseTransactions: number,
}

type TransactionAmountProps = BaseDateProps & {
  amount: number,
}

type IncomeExpenseTransactionAmountProps = BaseDateProps & {
  incomeAmount: number,
  expenseAmount: number,
}

export {
  type TransactionNumberProps,
  type IncomeExpenseTransactionNumberProps,
  type TransactionAmountProps,
  type IncomeExpenseTransactionAmountProps,
}