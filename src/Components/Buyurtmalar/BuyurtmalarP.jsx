import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { IoMdCreate } from 'react-icons/io';
import { Outlet, useNavigate } from 'react-router-dom';

const Buyurtmalar = () => {
  const navigate = useNavigate();
  const [categ, setCateg] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [img, setImg] = useState(null);

  const logoutFun = () => {
    localStorage.removeItem("tokenchik");
    navigate("/");
  };

  const getCategories = () => {
    fetch("https://realauto.limsa.uz/api/categories")
      .then((res) => res.json())
      .then((elem) => setCateg(elem?.data || []));
  };

  const createCateg = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    formData.append("images", img);

    fetch("https://realauto.limsa.uz/api/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenchik")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          alert("Kategoriya qo'shildi!");
          setModal(false);
          getCategories();
        } else {
          alert("Xatolik yuz berdi. Tekshirib ko'ring!");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const deleteCategory = (id) => {
    fetch(`https://realauto.limsa.uz/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenchik")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          alert("Kategoriya o'chirildi!");
          getCategories();
        } else {
          alert("O'chirishda xatolik yuz berdi!");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const updateCategory = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    if (img) formData.append("images", img);

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
          getCategories();
        } else {
          alert("Yangilashda xatolik yuz berdi!");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const openEditModal = (category) => {
    setSelectedId(category.id);
    setNameEn(category.name_en);
    setNameRu(category.name_ru);
    setImg(null);
    setEditModal(true);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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
        <button  class="button-85" role="button" onClick={logoutFun}>Log Out</button>
   
  
      {!modal && !editModal && <button class="button-85" role="button" onClick={() => setModal(true)}>Kategoriya qo'shish</button>}
     
      <table id="customers">
        <thead className='thead'>
          <tr>
            <th>ID</th>
            <th>Name_en</th>
            <th>Name_ru</th>
            <th>Image</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {categ?.map((items, ind) => (
            <tr key={ind}>
              <td>{ind + 1}</td>
              <td>{truncateText(items?.name_en, 8)}</td>
              <td>{truncateText(items?.name_ru, 8)}</td>
              <td>
                <div className='img_flex'>
                  <img
                    src={`https://realauto.limsa.uz/api/uploads/images/${items?.image_src}`}
                    alt={items?.name_en}
                  />
                </div>
              </td>
              <td>
                <button onClick={() => openEditModal(items)}><IoMdCreate /></button>
              </td>
              <td>
                <button onClick={() => deleteCategory(items?.id)}><IoClose /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className=''>
        <Outlet />
      </div>
    </div>
  );
};

export default Buyurtmalar;
