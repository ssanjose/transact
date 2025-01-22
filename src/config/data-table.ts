/**
 * Data Table InitialState Config
 */
const dataTableConfig = {
  columnVisibility: {
    id: false,
    name: true,
    date: true,
    frequency: false,
    categoryId: false,
    amount: true,
  },
  sorting: [
    {
      id: 'date',
      desc: true
    }
  ]
}

export default dataTableConfig;