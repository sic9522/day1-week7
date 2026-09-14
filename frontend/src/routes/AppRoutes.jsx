import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Bank from '../pages/Bank'
import Transfers from '../pages/Transfers'
import Conti from '../pages/Conti'
import Carte from '../pages/Carte'
import Impostazioni from '../pages/Impostazioni'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/registrati" element={<Register />} />
          <Route path="/banca" element={<Bank />} />
          <Route path="/banca/bonifici" element={<Transfers />} />
          <Route path="/banca/conti" element={<Conti />} />
          <Route path="/banca/carte" element={<Carte />} />
          <Route path="/banca/impostazioni" element={<Impostazioni />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
