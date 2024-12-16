import React, { } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Admin.scss";
import Logo from './img/logo.png'
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { MdDashboard, MdLocationOn } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import User_online from '../../Components/User_online/User_online';
import User_search from '../../Components/User_search/User_search'
const HomePage = () => {
  

  return (
    <div>
      <div className="admin_flex">
    
        <div className="admin_dashboard">
       
        <div className="btns"> 
       <button className="btn1"><AiFillHome />
       Buyurtmalar</button>
       
       <Link className="Link" to={'Buyurtmalar'}>
       <button className="btn1">
       <IoHomeSharp /> Buyurtmalar</button>
       </Link>
       <Link className="Link" to={'Сustomers'}>
       <button className="btn1">
       <FaUser /> Сustomers</button>
       </Link>
       <Link className="Link" to={'Toifalar'}>
       <button className="btn1">
       <MdDashboard />  Toifalar</button>
       </Link>
       <Link className="Link" to={'Mahsulotlar'}>
       <button className="btn1">
       <FaCartShopping />  Mahsulotlar</button>
       </Link>
       <Link className="Link" to={'Manzil'}>
       <button className="btn1">
       <MdLocationOn /> Manzil</button>
       </Link>
        </div>
        </div>
        
       <div className="navbar">
      
        <div className="nav">
        <div className="Logo">
       <img src={Logo} alt="" />
       </div>
         <User_search/>
        </div>
        <div className="nav">
          <User_online/>
        </div>
       </div>
       <div className="">
      <Outlet/>
      </div>
      </div>
    

      
    </div>
  );
};

export default HomePage;
