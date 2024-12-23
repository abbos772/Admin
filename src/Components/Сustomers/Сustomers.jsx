/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { IoMdCreate } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../Modal/Modal'

const Customers = () => {
	const [categ, setCateg] = useState([])
	const [modal, setModal] = useState(false)
	const [editModal, setEditModal] = useState(false)
	const [selectedId, setSelectedId] = useState(null)
	const [nameEn, setNameEn] = useState('')
	const [nameRu, setNameRu] = useState('')
	const [img, setImg] = useState(null)

	// Fetch categories (cities)
	const getCategories = () => {
		fetch('https://realauto.limsa.uz/api/cities')
			.then(res => res.json())
			.then(elem => setCateg(elem?.data || []))
			.catch(err => toast.error('Kategoriyalarni yuklashda xatolik yuz berdi!'))
	}

	// Create new category (city)
	const createCateg = e => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('name', nameEn)
		formData.append('text', nameRu)
		formData.append('images', img)

		fetch('https://realauto.limsa.uz/api/cities', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('tokenchik')}`,
			},
			body: formData,
		})
			.then(res => res.json())
			.then(data => {
				if (data?.success) {
					toast.success("Kategoriya qo'shildi!")
					setModal(false)
					resetForm()
					getCategories()
				} else {
					toast.error("Xatolik yuz berdi. Tekshirib ko'ring!")
				}
			})
			.catch(err => toast.error("Kategoriyani qo'shishda xatolik yuz berdi!"))
	}

	// Delete category (city)
	const deleteCategory = id => {
		fetch(`https://realauto.limsa.uz/api/cities/${id}`, {
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
			.catch(err => toast.error("Kategoriya o'chirishda xatolik yuz berdi!"))
	}

	// Update category (city)
	const updateCategory = e => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('name', nameEn)
		formData.append('text', nameRu)
		if (img) formData.append('images', img)

		fetch(`https://realauto.limsa.uz/api/cities/${selectedId}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('tokenchik')}`,
			},
			body: formData,
		})
			.then(res => res.json())
			.then(data => {
				if (data?.success) {
					toast.success('Kategoriya yangilandi!')
					setEditModal(false)
					resetForm()
					getCategories()
				} else {
					toast.error('Yangilashda xatolik yuz berdi!')
				}
			})
			.catch(err => toast.error('Kategoriyani yangilashda xatolik yuz berdi!'))
	}

	// Open edit modal with pre-filled category data
	const openEditModal = category => {
		setSelectedId(category.id)
		setNameEn(category.name)
		setNameRu(category.text)
		setImg(null) // Ensure that image is not retained during editing
		setEditModal(true)
	}

	// Reset form state (for both create and update)
	const resetForm = () => {
		setNameEn('')
		setNameRu('')
		setImg(null)
	}

	useEffect(() => {
		getCategories()
	}, [])

	// Truncate text for displaying shorter names
	const truncateText = (text, maxLength) => {
		return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text
	}

	return (
		<div>
			<ToastContainer position='top-right' autoClose={3000} />

			<Modal
				isOpen={modal || editModal}
				onClose={() => {
					setModal(false)
					setEditModal(false)
					resetForm()
				}}
				onSubmit={editModal ? updateCategory : createCateg}
				nameEn={nameEn}
				setNameEn={setNameEn}
				nameRu={nameRu}
				setNameRu={setNameRu}
				setImg={setImg}
				buttonText={editModal ? 'Yangilash' : "Qo'shish"}
			/>

			{!modal && !editModal && (
				<a onClick={() => setModal(true)} href='#' className='button'>
					Kategoriya qo'shish
				</a>
			)}

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
					{categ?.map((items, ind) => (
						<tr key={ind}>
							<td>{ind + 1}</td>
							<td>{truncateText(items?.name, 8)}</td>
							<td>{truncateText(items?.text, 8)}</td>
							<td>
								<div className='img_flex'>
									<img
										src={`https://realauto.limsa.uz/api/uploads/images/${items?.image_src}`}
										alt={items?.name_en}
									/>
								</div>
							</td>
							<td className='td_flex'>
								<button onClick={() => openEditModal(items)}>
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

			<div>
				<Outlet />
			</div>
		</div>
	)
}

export default Customers
