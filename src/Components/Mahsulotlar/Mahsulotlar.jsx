import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem } from '@mui/material';
import { IoMdCreate } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import './Mahsulotlar.scss';

const TOKEN = localStorage.getItem("tokenchik"); 

const Mahsulotlar = () => {
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentEditId, setCurrentEditId] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await axios.get('https://realauto.limsa.uz/api/brands');
      console.log(res?.data?.data);
      setBrand(res?.data?.data || []);
    } catch (error) {
      console.error('Brandlarni yuklashda xatolik:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await axios.get('https://realauto.limsa.uz/api/models', {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setModel(res?.data?.data || []);
    } catch (error) {
      console.error('Modelni yuklashda xatolik:', error);
    }
  };

  const handleCreateOrUpdate = async () => {
    const formData = new FormData();
    formData.append('name', nameEn);
    formData.append('brand_id', selectedBrand);

    try {
      if (editModal) {
        await axios.put(`https://realauto.limsa.uz/api/models/${currentEditId}`, formData, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        alert('Model yangilandi!');
      } else {
        await axios.post('https://realauto.limsa.uz/api/models', formData, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        alert('Model qo‘shildi!');
      }
      fetchModels();
      closeModal();
    } catch (error) {
      console.error('Modelni qo‘shishda/yangi qilishda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://realauto.limsa.uz/api/models/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      alert('Model o‘chirildi!');
      fetchModels();
    } catch (error) {
      console.error('Modelni o‘chirishda xatolik:', error);
    }
  };

  const openEditModal = (item) => {
    setEditModal(true);
    setNameEn(item.name || '');
    setNameRu(item.name_ru || '');
    setSelectedBrand(item.brand_id || null);
    setCurrentEditId(item.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditModal(false);
    setNameEn('');
    setNameRu('');
    setSelectedBrand(null);
    setCurrentEditId(null);
  };

  useEffect(() => {
    fetchBrands();
    fetchModels();
  }, []);

  const truncateText = (text, length) => {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <button className="button" onClick={() => setModalOpen(true)}>
        Model qo‘shish
      </button>

      <Modal open={modalOpen || editModal} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {editModal ? 'Model yangilash' : 'Model qo‘shish'}
          </Typography>
          <Select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e?.target?.value)}
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
            label="Name (EN)"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            onClick={handleCreateOrUpdate}
            variant="contained"
            disabled={!nameEn || !nameRu || !selectedBrand}
            sx={{ mt: 3 }}
          >
            {editModal ? 'Yangilash' : 'Qo‘shish'}
          </Button>
        </Box>
      </Modal>

      <table id="customers">
        <thead className="thead">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {model.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{truncateText(item.name, 12)}</td>
              <td>{truncateText(item.brand_title, 12)}</td>
              <td className="td_flex">
                <button onClick={() => openEditModal(item)}>
                  <IoMdCreate />
                </button>
                <button onClick={() => handleDelete(item.id)}>
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

export default Mahsulotlar;
