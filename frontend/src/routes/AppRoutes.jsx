import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Bank from '../pages/Bank'
import Transfers from '../pages/Transfers'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/registrati" element={<Register />} />
          <Route path="/banca" element={<Bank />} />
          <Route path="/banca/bonifici" element={<Transfers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
