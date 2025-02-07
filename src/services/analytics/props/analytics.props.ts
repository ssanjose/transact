type BaseDateProps = {
  year?: string,
  month?: string,
  date?: string,
}

// ------------------- TransactionNumberProps -------------------
type TransactionNumberProps = BaseDateProps & {
  transactions: number,
}

type IncomeAndExpenseTransactionNumberProps = BaseDateProps & {
  incomeTransactions: number,
  expenseTransactions: number,
}

// ------------------- AccountAmountProps -------------------
type AccountAmountProps = BaseDateProps & {
  amount: number,
}

type IncomeAndExpenseAccountAmountProps = BaseDateProps & {
  incomeAmount: number,
  expenseAmount: number,
}

export {
  type TransactionNumberProps,
  type IncomeAndExpenseTransactionNumberProps,
  type AccountAmountProps,
  type IncomeAndExpenseAccountAmountProps,
}