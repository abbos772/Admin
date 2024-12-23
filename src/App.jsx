import { useEffect } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import LoginPage from './Pages/LoginPage/LoginPage'
import Admin from './Pages/Admin/Admin'
import Buyurtmalar from './Components/Buyurtmalar/BuyurtmalarP'
import Сustomers from './Components/Сustomers/Сustomers'
import Toifalar from './Components/Toifalar/Toifalar'
import Mahsulotlar from './Components/Mahsulotlar/Mahsulotlar'
import Manzil from './Components/Manzil/Manzil'
import Cars from './Components/Cars/Cars'
function App() {
  const tokenxon = localStorage.getItem("tokenchik")
  const navigate = useNavigate();
  useEffect(() =>{
    if(!tokenxon){
      navigate("/")
    }else{
      navigate("/admin")
    }
  },[])
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/admin' element={<Admin/>}>
        <Route path='Buyurtmalar' element={<Buyurtmalar/>}/>
        <Route path='Сustomers' element={<Сustomers/>}/>
        <Route path='Toifalar' element={<Toifalar/>}/>
        <Route path='Mahsulotlar' element={<Mahsulotlar/>}/>
        <Route path='Manzil' element={<Manzil/>}/>
        <Route path='Cars' element={<Cars/>}/>
        </Route>  
        <Route/>
      </Routes>
    </>
  )
}

export default App
