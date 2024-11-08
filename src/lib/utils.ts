export default function getMonthlyData() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  let data;

  if (typeof window !== 'undefined') {
    data = JSON.parse(window.localStorage.getItem('financeData') || `{"${currentDate.getFullYear()}": {"${currentMonth}" : {}}}`);
  }

  const years = Object.keys(data).map(Number);
  const monthlyData = data[Math.max(...years)][currentMonth];
  return monthlyData;
}