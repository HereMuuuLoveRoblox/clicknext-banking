import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import DepositWithdraw from '@/pages/DepositWithdraw'
import TransactionHistory from '@/pages/TransactionHistory'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/deposit-withdraw" replace />} />
            <Route path="/deposit-withdraw" element={<DepositWithdraw />} />
            <Route path="/transaction" element={<TransactionHistory />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
