import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { IoMdCreate } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../Modal/Modal'

const Toifalar = () => {
	const [categ, setCateg] = useState([])
	const [modal, setModal] = useState(false)
	const [editModal, setEditModal] = useState(false)
	const [selectedId, setSelectedId] = useState(null)
	const [nameEn, setNameEn] = useState('')
	const [nameRu, setNameRu] = useState('')
	const [img, setImg] = useState(null)

	const getCategories = () => {
		fetch('https://realauto.limsa.uz/api/brands')
			.then(res => res.json())
			.then(elem => setCateg(elem?.data || []))
			.catch(err => toast.error('Kategoriyalarni yuklashda xatolik yuz berdi!'))
	}

	const createCateg = e => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('title', nameEn)
		formData.append('images', img)

		fetch('https://realauto.limsa.uz/api/brands', {
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
					getCategories()
				} else {
					toast.error("Xatolik yuz berdi. Tekshirib ko'ring!")
				}
			})
			.catch(err => toast.error("Kategoriyani qo'shishda xatolik yuz berdi!"))
	}

	const updateCategory = e => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('title', nameEn)
		if (img) formData.append('images', img)

		fetch(`https://realauto.limsa.uz/api/brands/${selectedId}`, {
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
					getCategories()
				} else {
					toast.error('Yangilashda xatolik yuz berdi!')
				}
			})
			.catch(err => toast.error('Kategoriyani yangilashda xatolik yuz berdi!'))
	}

	const openEditModal = category => {
		setSelectedId(category.id)
		setNameEn(category.name_en)
		setNameRu(category.name_ru)
		setImg(null)
		setEditModal(true)
	}

	const deleteCategory = id => {
		fetch(`https://realauto.limsa.uz/api/brands/${id}`, {
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
			.catch(err => toast.error("Kategoriyani o'chirishda xatolik yuz berdi!"))
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

			{/* Modal for Creating */}
			<Modal
				isOpen={modal}
				onClose={() => setModal(false)}
				onSubmit={createCateg}
				nameEn={nameEn}
				setNameEn={setNameEn}
				nameRu={nameRu}
				setNameRu={setNameRu}
				setImg={setImg}
				buttonText="Qo'shish"
			/>

			{/* Modal for Editing */}
			<Modal
				isOpen={editModal}
				onClose={() => setEditModal(false)}
				onSubmit={updateCategory}
				nameEn={nameEn}
				setNameEn={setNameEn}
				nameRu={nameRu}
				setNameRu={setNameRu}
				setImg={setImg}
				buttonText='Yangilash'
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
						<th>Name_ru</th>
						<th>Image</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					{categ?.map((items, ind) => (
						<tr key={ind}>
							<td>{ind + 1}</td>
							<td>{truncateText(items?.title, 8)}</td>
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

export default Toifalar
