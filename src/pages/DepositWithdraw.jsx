import { useState } from 'react'
import { toast } from 'sonner'
import useBankStore, { TRANSACTION_TYPE } from '@/store/useBankStore'
import { getCookie } from '@/lib/cookie'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const MIN_AMOUNT = 0
const MAX_AMOUNT = 100000

function formatCurrency(value) {
  return value.toLocaleString('th-TH', { minimumFractionDigits: 2 })
}

function DepositWithdraw() {
  const balance = useBankStore((state) => state.balance)
  const deposit = useBankStore((state) => state.deposit)
  const withdraw = useBankStore((state) => state.withdraw)

  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [pendingAction, setPendingAction] = useState(null)

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    setError('')
  }

  const validate = () => {
    const numAmount = Number(amount)
    if (!amount || numAmount <= MIN_AMOUNT || numAmount > MAX_AMOUNT) {
      setError(`กรอกจำนวนเงินระหว่าง ${MIN_AMOUNT.toLocaleString()} - ${MAX_AMOUNT.toLocaleString()} บาท`)
      return null
    }
    return numAmount
  }

  const handleDeposit = () => {
    const numAmount = validate()
    if (numAmount === null) return

    setPendingAction({ type: TRANSACTION_TYPE.DEPOSIT, amount: numAmount })
  }

  const handleWithdraw = () => {
    const numAmount = validate()
    if (numAmount === null) return

    if (numAmount > balance) {
      setError('ยอดเงินคงเหลือไม่เพียงพอ')
      return
    }

    setPendingAction({ type: TRANSACTION_TYPE.WITHDRAW, amount: numAmount })
  }

  const handleConfirm = () => {
    const { type, amount: numAmount } = pendingAction
    const email = getCookie('email')

    if (type === TRANSACTION_TYPE.DEPOSIT) {
      deposit(numAmount, email)
      toast.success('ฝากเงินสำเร็จ', { description: `+${formatCurrency(numAmount)} บาท` })
    } else {
      withdraw(numAmount, email)
      toast.success('ถอนเงินสำเร็จ', { description: `-${formatCurrency(numAmount)} บาท` })
    }

    setAmount('')
    setPendingAction(null)
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ยอดเงินคงเหลือ</CardTitle>
          <CardDescription className="text-3xl font-bold text-foreground">
            {formatCurrency(balance)} บาท
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">จำนวนเงิน</Label>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              aria-invalid={!!error}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleDeposit}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              ฝากเงิน
            </Button>
            <Button variant="destructive" onClick={handleWithdraw}>
              ถอนเงิน
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ยืนยันการ{pendingAction?.type === TRANSACTION_TYPE.DEPOSIT ? 'ฝากเงิน' : 'ถอนเงิน'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ต้องการ{pendingAction?.type === TRANSACTION_TYPE.DEPOSIT ? 'ฝาก' : 'ถอน'}เงินจำนวน{' '}
              <span className="font-semibold text-foreground">
                {pendingAction && formatCurrency(pendingAction.amount)} บาท
              </span>{' '}
              ใช่หรือไม่
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                pendingAction?.type === TRANSACTION_TYPE.DEPOSIT
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-destructive text-white hover:bg-destructive/90'
              }
            >
              ยืนยัน{pendingAction?.type === TRANSACTION_TYPE.DEPOSIT ? 'ฝากเงิน' : 'ถอนเงิน'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DepositWithdraw
