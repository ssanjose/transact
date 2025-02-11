type BaseDateProps = {
  date: string,
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

// ------------------- AccountProps -------------------
type AccountTotalAmountProps = BaseDateProps & {
  accountAmount: number,
}

// ------------------- TimeSeriesData -------------------
type TimeSeriesData = BaseDateProps & {
  [key: string]: number | string;
}

export {
  type TransactionNumberProps,
  type IncomeExpenseTransactionNumberProps,
  type TransactionAmountProps,
  type IncomeExpenseTransactionAmountProps,

  type AccountTotalAmountProps,

  type TimeSeriesData,
}