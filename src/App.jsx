import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/deposit-withdraw" replace />} />
        <Route
          path="/deposit-withdraw"
          element={<div>Deposit / Withdraw page placeholder</div>}
        />
        <Route
          path="/transaction"
          element={<div>Transaction page placeholder</div>}
        />
      </Route>
    </Routes>
  )
}

export default App
