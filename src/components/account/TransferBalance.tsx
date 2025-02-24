'use client'
import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { transferBalanceSchema } from '@/lib/validation/formSchemas'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Account,
  Category,
  Frequency,
  TransactionType,
} from '@/lib/db/db.model'
import { Inter } from 'next/font/google'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import {
  DeleteCategoryButton,
  EditCategoryButton,
  OpenCategoryButton,
} from '../category/CategoryButtons'
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryService } from '@/services/category.service'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDialog } from '@/hooks/use-dialog'
import CalendarWithTime from '../transaction/CalendarWithTime'
import { format } from 'date-fns'
import { TransactionService } from '@/services/transaction.service'
import { AccountService } from '@/services/account.service'
const inter = Inter({ subsets: ['latin'] })

interface AccountFormProps {
  className?: string
  onSave: () => void
  Accounts?: Account[]
  Account?: Account
}

const TransferBalance = ({
  className,
  onSave,
  Accounts,
  Account,
}: AccountFormProps) => {
  const { toast } = useToast()
  const categories = useLiveQuery(() => CategoryService.getAllCategories())
  const [category, setCategory] = React.useState<Category | undefined>(
    undefined
  )

  const [modal, setModal] = React.useState(false)
  const editCategory = { ...useDialog() }
  editCategory.dismiss = () => closeModal()

  const deleteCategory = useDialog()

  const closeModal = () => {
    editCategory.dialogProps.onOpenChange(false)
    deleteCategory.dialogProps.onOpenChange(false)
    setModal(false)
  }

  const form = useForm<z.infer<typeof transferBalanceSchema>>({
    resolver: zodResolver(transferBalanceSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date(),
      id: undefined,
      name: '',
      amount: 0.00,
      type: TransactionType.Expense,
      accountTransferId: undefined,
      frequency: Frequency.OneTime,
      status: 'pending',
      accountAmount: undefined,
      accountId: Account?.id ?? undefined,
      categoryId: undefined,
      transactionId: undefined,
    },
  })

  const amount = form.watch('amount')
  const accountId = form.watch('accountId')
  const accountBalance = useLiveQuery(
    () => (accountId ? AccountService.getAccount(accountId) : undefined),
    [accountId]
  )

  const onSubmit = async (values: z.infer<typeof transferBalanceSchema>) => {
    if (modal || !form.formState.isValid) return

    try {
      const transactionWithdraw = {
        id: values.id,
        name: values.name,
        amount: Math.round(values.amount * 100) / 100,
        date: values.date,
        type: TransactionType.Expense,
        frequency: values.frequency,
        status: values.status,
        accountAmount: values.accountAmount,
        accountId: values.accountId,
        categoryId: values.categoryId === null ? undefined : values.categoryId,
        transactionId: values.transactionId,
      }
      const transactionTransfer = {
        ...transactionWithdraw,
        type: TransactionType.Income,
        accountId: values.accountTransferId,
      }

      await TransactionService.transferBalance(
        transactionWithdraw,
        transactionTransfer
      )
      toast({
        variant: 'default',
        title: 'Balance Transfered',
        description: `Balance has been transfered successfully of Amount ${values.amount}`,
      })
    } catch (e) {
      let result = (e as Error).message
      if (typeof e === 'string') result = e
      else if (e instanceof Error) result = e.message

      toast({
        variant: 'destructive',
        title: 'Error',
        description: result,
      })
    }
    onSave()
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          'flex flex-col items-start gap-2',
          className,
          inter.className
        )}
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-muted-foreground font-normal">
                Title e.g. &apos;Insurance&apos;, &apos;Quick Shopping&apos;.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Select Account</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={Account?.id!.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Withdraw Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {Accounts?.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id?.toString()!}>
                          {account.name} ({account.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the account to withdraw the amount from
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="accountTransferId"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Select Account</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Transfer Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {Accounts?.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id?.toString()!}>
                          {account.name} ({account.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the account to transfer the amount to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
                {amount > accountBalance?.balance! && (
                  <FormMessage>
                    Insufficient balance. Available: {accountBalance?.balance}
                  </FormMessage>
                )}
                <FormDescription>
                  Amount to transfer to the selected account
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      {field.value ? (
                        format(field.value, 'PPP p')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-fit"
                  align="center">
                  <CalendarWithTime
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
              <FormDescription className="text-muted-foreground font-normal">
                Date when it happens.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Category</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground'
                      )}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded mr-2 ${
                            !field.value ? 'hidden' : 'block'
                          }`}
                          style={{
                            backgroundColor: categories?.find(
                              (category) => category.id === field.value
                            )?.color,
                          }}
                        />
                        {field.value
                          ? categories?.find(
                              (category) => category.id === field.value
                            )?.name
                          : 'Select a category'}
                      </div>
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <div className="flex flex-row">
                      <CommandInput
                        placeholder="Search categories..."
                        className="h-9 w-full"
                        disabled={false}
                      />
                      <OpenCategoryButton />
                    </div>
                    <CommandList>
                      <CommandEmpty>No categories found</CommandEmpty>
                      <CommandGroup>
                        {categories?.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              if (category.id === field.value)
                                field.onChange(null)
                              else field.onChange(category.id)
                            }}
                            className="flex items-center w-full">
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                            <Check
                              className={cn(
                                'ml-auto',
                                category.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="size-5 p-0 text-right self-end z-10"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCategory(category)
                                  }}>
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setModal(true)
                                    editCategory.trigger()
                                  }}>
                                  Edit Category
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setModal(true)
                                    deleteCategory.trigger()
                                  }}>
                                  Delete Category
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
              <FormDescription className="text-muted-foreground font-normal">
                What category it belongs to?
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex gap-2 mt-2">
          <Button type="submit">Transfer</Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              onSave()
            }}>
            Cancel
          </Button>
          <EditCategoryButton
            existingCategory={category}
            dialogProps={() => editCategory}
            visible={false}
            title={`Edit ${category?.name}`}
          />
          <DeleteCategoryButton
            id={category?.id || -1}
            dialogProps={() => deleteCategory}
            visible={false}
          />
        </div>
      </form>
    </Form>
  )
}

export { TransferBalance }
