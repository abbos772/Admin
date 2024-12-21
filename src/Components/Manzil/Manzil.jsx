import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCreate } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

const TOKEN = localStorage.getItem("tokenchik");

const Manzil = () => {
  const [categ, setCateg] = useState([]);
  const [brand, setBrand] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch Categories
  const getCategories = () => {
    fetch('https://realauto.limsa.uz/api/locations')
      .then((res) => res.json())
      .then((elem) => setCateg(elem?.data || []))
      .catch(() => toast.error('Manzillarni yuklashda xatolik yuz berdi!'));
  };

  // Fetch Brands
  const fetchBrands = async () => {
    try {
      const res = await fetch('https://realauto.limsa.uz/api/brands');
      const data = await res.json();
      if (data?.data) {
        setBrand(data.data); // Update brand state with the response data
      } else {
        toast.error('Brendlarni yuklashda xatolik yuz berdi!');
      }
    } catch (error) {
      toast.error('Brendlarni yuklashda xatolik yuz berdi!');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditModal(false);
    setName('');
    setText('');
    setImg(null);
    setSelectedBrand(null); // Clear selected brand
  };

  // Create Category
  const createCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('text', text);
    formData.append('images', img);
    formData.append('brand_id', selectedBrand); // Add brand_id

    fetch('https://realauto.limsa.uz/api/locations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success("Manzil qo'shildi!");
          closeModal();
          getCategories();
        } else toast.error("Xatolik yuz berdi. Tekshirib ko'ring!");
      })
      .catch(() => toast.error("Manzil qo'shishda xatolik yuz berdi!"));
  };

  // Update Category
  const updateCategory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('text', text);
    if (img) formData.append('images', img);
    formData.append('brand_id', selectedBrand); // Add brand_id

    fetch(`https://realauto.limsa.uz/api/locations/${selectedId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          toast.success('Manzil yangilandi!');
          closeModal();
          getCategories();
        } else toast.error('Yangilashda xatolik yuz berdi!');
      })
      .catch(() => toast.error('Manzilni yangilashda xatolik yuz berdi!'));
  };

  useEffect(() => {
    getCategories();
    fetchBrands(); // Fetch the brands when the component mounts
  }, []);

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <a className="button" onClick={() => setModalOpen(true)} href="#">
        Manzil qo'shish
      </a>

      <Modal
        open={modalOpen || editModal}
        onClose={closeModal}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            {editModal ? 'Manzilni yangilash' : 'Manzil qo‘shish'}
          </Typography>

          {/* Brand Select Dropdown */}
          <Select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>
              Brendni tanlang
            </MenuItem>
            {brand.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                Brendlar yuklanmoqda...
              </Typography>
            ) : (
              brand.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))
            )}
          </Select>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Button
            onClick={editModal ? updateCategory : createCategory}
            variant="contained"
            disabled={!name || !text || !selectedBrand} // Ensure brand is selected
            sx={{ mt: 3 }}
          >
            {editModal ? 'Yangilash' : 'Qo‘shish'}
          </Button>
        </Box>
      </Modal>

      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Text</th>
            <th>Image</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {categ.map((items, ind) => (
            <tr key={ind}>
              <td>{ind + 1}</td>
              <td>{truncateText(items?.name, 8)}</td>
              <td>{truncateText(items?.text, 8)}</td>
              <div className='img_flex'>
                <img  src={`https://realauto.limsa.uz/api/uploads/images/${items?.image_src}`}  alt={items?.name}   />
                </div>
              <td className="td_flex">
                <button
                  onClick={() => {
                    setEditModal(true);
                    setSelectedId(items.id);
                    setName(items.name);
                    setText(items.text);
                    setSelectedBrand(items.brand_id); // Pre-select the brand
                  }}
                >
                  <IoMdCreate />
                </button>
                <button onClick={() => deleteCategory(items?.id)}>
                  <IoClose />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Manzil;
