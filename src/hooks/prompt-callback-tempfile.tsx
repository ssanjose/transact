import { useDialog } from '@/hooks/use-dialog';
import { useState } from 'react';
import { Transaction } from '../lib/db/db.model';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';

const promptUser: PromptCallback = async (outOfBoundChildTransactions) => {
  return new Promise<'preserve' | 'delete'>((resolve) => {
    const { trigger, dialogProps, triggerProps } = useDialog();

    const handleDecision = (decision: 'preserve' | 'delete') => {
      resolve(decision);
      dialogProps.onOpenChange(false);
    };

    // Render the dialog to prompt the user
    const PromptDialog = () => (
      <Dialog {...dialogProps}>
        <DialogTrigger {...triggerProps}>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Out-of-Bound Transactions</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            There are transactions that fall outside the new date range. What would you like to do with them?
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => handleDecision('preserve')}>Preserve</Button>
            <Button onClick={() => handleDecision('delete')}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Trigger the dialog
    trigger();
  });
};
export type PromptCallback = (outOfBoundChildTransactions: Transaction[]) => Promise<'preserve' | 'delete'>;
/**
 * Custom hook to handle prompt callback for out-of-bound child transactions.
 *
 * @returns {PromptCallback} - The prompt callback function.
 */
function usePromptCallback(): PromptCallback {
  const [decision, setDecision] = useState<'preserve' | 'delete'>('preserve');

  const promptCallback: PromptCallback = async (outOfBoundChildTransactions) => {
    // Implement your logic to prompt the user and get their decision
    // For example, you can use a modal or a confirmation dialog
    // Here, we are just returning the current decision state
    return decision;
  };

  return promptCallback;
}

export { usePromptCallback };