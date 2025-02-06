type BaseDateProps = {
  year?: string,
  month?: string,
  date?: string,
}

// ------------------- TransactionsByDateProps -------------------
type TransactionsByDateProps = BaseDateProps & {
  transactions: number,
}

type IncomeAndExpenseTransactionsByDateProps = BaseDateProps & {
  incomeTransactions: number,
  expenseTransactions: number,
}

// ------------------- AccountAmountByDateProps -------------------
type AmountProps = BaseDateProps & {
  amount: number,
}

type IncomeAndExpenseAmountProps = BaseDateProps & {
  incomeAmount: number,
  expenseAmount: number,
}

export {
  type TransactionsByDateProps,
  type IncomeAndExpenseTransactionsByDateProps,
  type AmountProps,
  type IncomeAndExpenseAmountProps,
}