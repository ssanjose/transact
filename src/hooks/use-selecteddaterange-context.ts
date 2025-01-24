import React from 'react';
import { SelectedDateRange } from '@/services/analytics/props/date-range.props';

export const SelectedDateRangeContext = React.createContext<SelectedDateRange | undefined>(SelectedDateRange.DAY);

export const useSelectedDateRangeContext = () => {
  const selectedDateRange = React.useContext(SelectedDateRangeContext);

  if (selectedDateRange === undefined) {
    throw new Error('useSelectedDateRangeContext must be used within a SelectedDateRangeProvider');
  }

  return selectedDateRange;
}