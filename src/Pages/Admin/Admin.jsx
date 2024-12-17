import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Admin.scss";
import Logo from './img/logo.png';
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { MdDashboard, MdLocationOn } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import User_online from '../../Components/User_online/User_online';
import User_search from '../../Components/User_search/User_search';

const HomePage = () => {
  const [editModal, setEditModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [img, setImg] = useState(null);
  const navigate = useNavigate();

  const logoutFun = () => {
    localStorage.removeItem("tokenchik");
    navigate("/");
  };

  const openEditModal = (category) => {
    setSelectedId(category.id);
    setNameEn(category.name_en);
    setNameRu(category.name_ru);
    setImg(null);
    setEditModal(true);
  };

  const updateCategory = () => {
    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    if (img) formData.append("image", img);

    fetch(`https://realauto.limsa.uz/api/categories/${selectedId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenchik")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          alert("Kategoriya yangilandi!");
          setEditModal(false);
          // getCategories() funksiyasini chaqirish kerak
        } else {
          alert("Yangilashda xatolik yuz berdi!");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div>
      {modal && (
              <div className="modal-overlay">
                <form onSubmit={createCateg} className="form2">
                  <button className="close-button" onClick={() => setModal(false)}>
                    <IoClose />
                  </button>
                  <input
                    type="text"
                    placeholder="Name EN"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Name RU"
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImg(e?.target?.files[0])}
                  />
                  <button type="submit">Qo'shish</button>
                </form>
              </div>
            )}
            {editModal && (
              <div className="modal-overlay">
                <form onSubmit={updateCategory} className="form2">
                  <button className="close-button" onClick={() => setEditModal(false)}>
                    <IoClose />
                  </button>
                  <input
                    type="text"
                    placeholder="Name EN"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Name RU"
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImg(e?.target?.files[0])}
                  />
                  <button type="submit">Yangilash</button>
                </form>
              </div>
            )}
             
      <div className="admin_flex">
        <div className="admin_dashboard">
          <div className="btns">
            <button className="btn1"><AiFillHome /> Buyurtmalar</button>
            <Link className="Link" to={'Buyurtmalar'}>
              <button className="btn1"><IoHomeSharp /> Buyurtmalar</button>
            </Link>
            <Link className="Link" to={'Сustomers'}>
              <button className="btn1"><FaUser /> Сustomers</button>
            </Link>
            <Link className="Link" to={'Toifalar'}>
              <button className="btn1"><MdDashboard /> Toifalar</button>
            </Link>
            <Link className="Link" to={'Mahsulotlar'}>
              <button className="btn1"><FaCartShopping /> Mahsulotlar</button>
            </Link>
            <Link className="Link" to={'Manzil'}>
              <button className="btn1"><MdLocationOn /> Manzil</button>
            </Link>
          </div>
        </div>
        
        <div className="navbar">
          <div className="nav">
            <div className="Logo">
              <img src={Logo} alt="" />
            </div>
            <User_search />
          </div>
          <div className="nav">
             <a href="#"   onClick={logoutFun} class="button">Log Out</a>
          
            <User_online />
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
