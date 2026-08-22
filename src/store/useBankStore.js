import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
}

// คำนวนยอดเงินคงเหลือ
function recalcBalance(transactions) {
  let balance = 0

  for (const tx of transactions) {
    if (tx.type === TRANSACTION_TYPE.DEPOSIT) {
      balance += tx.amount
    } else {
      balance -= tx.amount
    }
  }

  return balance
}

// สร้าง Transaction ใหม่
function createTransaction({ id, type, amount, email }) {
  return {
    id,
    datetime: new Date().toISOString(),
    type,
    amount,
    email,
  }
}

const useBankStore = create(
  persist(
    (set) => ({
      balance: 0,
      transactions: [],
      nextId: 1,

      deposit: (amount, email) =>
        set((state) => {
          const transactions = [
            createTransaction({ id: state.nextId, type: TRANSACTION_TYPE.DEPOSIT, amount, email }),
            ...state.transactions,
          ]
          return { transactions, balance: recalcBalance(transactions), nextId: state.nextId + 1 }
        }),

      withdraw: (amount, email) =>
        set((state) => {
          const transactions = [
            createTransaction({ id: state.nextId, type: TRANSACTION_TYPE.WITHDRAW, amount, email }),
            ...state.transactions,
          ]
          return { transactions, balance: recalcBalance(transactions), nextId: state.nextId + 1 }
        }),

      editTransaction: (id, amount) => {
        let success = false
        set((state) => {
          const transactions = state.transactions.map((tx) =>
            tx.id === id ? { ...tx, amount } : tx
          )
          const balance = recalcBalance(transactions)
          if (balance < 0) return state

          success = true
          return { transactions, balance }
        })
        return success
      },

      deleteTransaction: (id) => {
        let success = false
        set((state) => {
          const transactions = state.transactions.filter((tx) => tx.id !== id)
          const balance = recalcBalance(transactions)
          if (balance < 0) return state

          success = true
          return { transactions, balance }
        })
        return success
      },
    }),
    { name: 'bank-storage' }
  )
)

export default useBankStore
