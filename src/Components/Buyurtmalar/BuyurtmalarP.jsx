import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { IoMdCreate } from 'react-icons/io'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../Modal/Modal'

const Buyurtmalar = () => {
	const [categories, setCategories] = useState([])
	const [modalOpen, setModalOpen] = useState(false)
	const [editModal, setEditModal] = useState(false)
	const [selectedId, setSelectedId] = useState(null)
	const [nameEn, setNameEn] = useState('')
	const [nameRu, setNameRu] = useState('')
	const [img, setImg] = useState(null)

	const getCategories = () => {
		fetch('https://realauto.limsa.uz/api/categories')
			.then(res => res.json())
			.then(data => setCategories(data?.data || []))
			.catch(() => toast.error('Kategoriyalarni yuklashda xatolik yuz berdi!'))
	}

	const handleCreateOrUpdate = e => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('name_en', nameEn)
		formData.append('name_ru', nameRu)
		if (img) formData.append('images', img)

		const url = editModal
			? `https://realauto.limsa.uz/api/categories/${selectedId}`
			: 'https://realauto.limsa.uz/api/categories'

		const method = editModal ? 'PUT' : 'POST'

		fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('tokenchik')}`,
			},
			body: formData,
		})
			.then(res => res.json())
			.then(data => {
				if (data?.success) {
					toast.success(
						editModal ? 'Kategoriya yangilandi!' : "Kategoriya qo'shildi!"
					)
					closeModal()
					getCategories()
				} else {
					toast.error("Xatolik yuz berdi. Tekshirib ko'ring!")
				}
			})
			.catch(() => toast.error('Kategoriyani saqlashda xatolik yuz berdi!'))
	}

	const deleteCategory = id => {
		fetch(`https://realauto.limsa.uz/api/categories/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('tokenchik')}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				if (data?.success) {
					toast.success("Kategoriya o'chirildi!")
					getCategories()
				} else {
					toast.error("O'chirishda xatolik yuz berdi!")
				}
			})
			.catch(() => toast.error("Kategoriyani o'chirishda xatolik yuz berdi!"))
	}

	const openCreateModal = () => {
		setNameEn('')
		setNameRu('')
		setImg(null)
		setModalOpen(true)
	}

	const openEditModal = category => {
		setSelectedId(category.id)
		setNameEn(category.name_en)
		setNameRu(category.name_ru)
		setImg(null)
		setEditModal(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setEditModal(false)
		setNameEn('')
		setNameRu('')
		setImg(null)
	}

	useEffect(() => {
		getCategories()
	}, [])

	const truncateText = (text, maxLength) => {
		return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text
	}

	return (
		<div>
			<ToastContainer position='top-right' autoClose={3000} />
			<a className='button' onClick={() => setModalOpen(true)} href='#'>
				Kategoriya qo'shish
			</a>

			<Modal
				isOpen={modalOpen || editModal}
				onClose={closeModal}
				onSubmit={handleCreateOrUpdate}
				nameEn={nameEn}
				setNameEn={setNameEn}
				nameRu={nameRu}
				setNameRu={setNameRu}
				setImg={setImg}
				buttonText={editModal ? 'Yangilash' : "Qo'shish"}
			/>

			<table id='customers'>
				<thead className='thead'>
					<tr>
						<th>ID</th>
						<th>Name_en</th>
						<th>Name_ru</th>
						<th>Image</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					{categories?.map((item, index) => (
						<tr key={item.id}>
							<td>{index + 1}</td>
							<td>{truncateText(item.name_en, 8)}</td>
							<td>{truncateText(item.name_ru, 8)}</td>
							<td>
								<div className='img_flex'>
									<img
										src={`https://realauto.limsa.uz/api/uploads/images/${item.image_src}`}
										alt={item.name_en}
									/>
								</div>
							</td>
							<td className='td_flex'>
								<button onClick={() => openEditModal(item)}>
									<IoMdCreate />
								</button>
								<button onClick={() => deleteCategory(item.id)}>
									<IoClose />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div>
				<Outlet />
			</div>
		</div>
	)
}

export default Buyurtmalar
