import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import useBankStore, { TRANSACTION_TYPE } from '@/store/useBankStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Card, CardContent } from '@/components/ui/card'

const MIN_AMOUNT = 0
const MAX_AMOUNT = 100000

function formatCurrency(value) {
  return value.toLocaleString('th-TH', { minimumFractionDigits: 2 })
}

function formatDatetime(isoString) {
  return new Date(isoString).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getTypeMeta(tx) {
  const isDeposit = tx.type === TRANSACTION_TYPE.DEPOSIT
  return {
    isDeposit,
    sign: isDeposit ? '+' : '-',
    label: isDeposit ? 'ฝากเงิน' : 'ถอนเงิน',
    amountClass: isDeposit ? 'text-green-600' : 'text-destructive',
    badgeClass: isDeposit
      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
      : 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-destructive',
  }
}

function StatusBadge({ tx }) {
  const { label, badgeClass } = getTypeMeta(tx)
  return <span className={badgeClass}>{label}</span>
}

function AmountText({ tx }) {
  const { sign, amountClass } = getTypeMeta(tx)
  return (
    <span className={amountClass}>
      {sign}
      {formatCurrency(tx.amount)}
    </span>
  )
}

function TransactionActions({ onEdit, onDelete }) {
  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={onEdit}>
        <Pencil />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onDelete}>
        <Trash2 className="text-destructive" />
      </Button>
    </>
  )
}

function TransactionCardList({ transactions, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      {transactions.map((tx) => (
        <Card key={tx.id}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">{formatDatetime(tx.datetime)}</p>
              <span className="font-semibold flex flex-col gap-1">
                <StatusBadge tx={tx} />
                <AmountText tx={tx} />
              </span>
            </div>
            <div className="flex justify-between gap-1">
              <p className="truncate text-sm text-muted-foreground">{tx.email}</p>
              <div className="flex gap-6">
                <TransactionActions onEdit={() => onEdit(tx)} onDelete={() => onDelete(tx)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="hidden rounded-lg border sm:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>วันที่</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>ประเภทธุรกรรม</TableHead>
            <TableHead>อีเมล</TableHead>
            <TableHead className="text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDatetime(tx.datetime)}</TableCell>
              <TableCell>
                <AmountText tx={tx} />
              </TableCell>
              <TableCell>
                <StatusBadge tx={tx} />
              </TableCell>
              <TableCell>{tx.email}</TableCell>
              <TableCell className="text-right">
                <TransactionActions onEdit={() => onEdit(tx)} onDelete={() => onDelete(tx)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function EditTransactionDialog({ tx, amount, error, onAmountChange, onSave, onClose }) {
  return (
    <Dialog open={!!tx} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขรายการ</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-amount">จำนวนเงิน</Label>
          <Input
            id="edit-amount"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={onAmountChange}
            aria-invalid={!!error}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={onSave}>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteTransactionDialog({ tx, onConfirm, onClose }) {
  return (
    <AlertDialog open={!!tx} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบรายการ</AlertDialogTitle>
          <AlertDialogDescription render={<div />} className="flex flex-col gap-1">
            <p>ต้องการลบรายการนี้ใช่หรือไม่ การลบไม่สามารถย้อนกลับได้</p>
            {tx && (
              <div className="mt-2 flex flex-col gap-1 rounded-md bg-muted p-3 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">วันที่</span>
                  <span>{formatDatetime(tx.datetime)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">จำนวนเงิน</span>
                  <span>
                    <AmountText tx={tx} /> บาท
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">อีเมล</span>
                  <span className="truncate">{tx.email}</span>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onConfirm}
          >
            ลบรายการ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function TransactionHistory() {
  const transactions = useBankStore((state) => state.transactions)
  const editTransaction = useBankStore((state) => state.editTransaction)
  const deleteTransaction = useBankStore((state) => state.deleteTransaction)

  const [editingTx, setEditingTx] = useState(null)
  const [editAmount, setEditAmount] = useState('')
  const [editError, setEditError] = useState('')
  const [deletingTx, setDeletingTx] = useState(null)

  const openEdit = (tx) => {
    setEditingTx(tx)
    setEditAmount(String(tx.amount))
    setEditError('')
  }

  const handleEditAmountChange = (e) => {
    setEditAmount(e.target.value.replace(/[^0-9]/g, ''))
    setEditError('')
  }

  const handleSaveEdit = () => {
    const numAmount = Number(editAmount)
    if (!editAmount || numAmount <= MIN_AMOUNT || numAmount > MAX_AMOUNT) {
      setEditError(`กรอกจำนวนเงินระหว่าง ${MIN_AMOUNT.toLocaleString()} - ${MAX_AMOUNT.toLocaleString()} บาท`)
      return
    }

    const success = editTransaction(editingTx.id, numAmount)
    if (!success) {
      setEditError('แก้ไขไม่ได้ เพราะจะทำให้ยอดคงเหลือติดลบ')
      return
    }

    toast.success('แก้ไขรายการสำเร็จ')
    setEditingTx(null)
  }

  const handleConfirmDelete = () => {
    const success = deleteTransaction(deletingTx.id)
    if (!success) {
      toast.error('ลบไม่ได้ เพราะจะทำให้ยอดคงเหลือติดลบ')
      setDeletingTx(null)
      return
    }

    toast.success('ลบรายการสำเร็จ')
    setDeletingTx(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">ประวัติธุรกรรม</h1>

      {transactions.length === 0 ? (
        <p className="rounded-lg border p-4 text-center text-muted-foreground">
          ยังไม่มีรายการธุรกรรม
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            แสดง 1 ถึง {transactions.length} จาก {transactions.length} รายการ
          </p>
          <TransactionCardList transactions={transactions} onEdit={openEdit} onDelete={setDeletingTx} />
          <TransactionTable transactions={transactions} onEdit={openEdit} onDelete={setDeletingTx} />
        </>
      )}

      <EditTransactionDialog
        tx={editingTx}
        amount={editAmount}
        error={editError}
        onAmountChange={handleEditAmountChange}
        onSave={handleSaveEdit}
        onClose={() => setEditingTx(null)}
      />

      <DeleteTransactionDialog
        tx={deletingTx}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingTx(null)}
      />
    </div>
  )
}

export default TransactionHistory
