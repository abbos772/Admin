import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { ToastContainer } from "react-toast";
import { IoMdCreate } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflowY: "auto",
  overflowX: "hidden",
  p: 4,
};

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [modal, setModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [element, setElement] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    city: "",
    category: "",
    location: "",
    transmission: "",
    image: null,  // Added for image
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("tokenchik");

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setter(data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getCars = () => fetchData("https://realauto.limsa.uz/api/cars", setCars);
  const getBrands = () => fetchData("https://realauto.limsa.uz/api/brands", setBrands);
  const getModels = () => fetchData("https://realauto.limsa.uz/api/models", setModels);
  const getCities = () => fetchData("https://realauto.limsa.uz/api/cities", setCities);
  const getCategories = () => fetchData("https://realauto.limsa.uz/api/categories", setCategories);
  const getLocations = () => fetchData("https://realauto.limsa.uz/api/locations", setLocations);

  const handleModal = (id) => {
    const selectedCar = cars.find((car) => car.id === id);
    setElement(selectedCar || null);
    setFormData({
      brand: selectedCar?.brand || "",
      model: selectedCar?.model || "",
      city: selectedCar?.city || "",
      category: selectedCar?.category || "",
      location: selectedCar?.location || "",
      transmission: selectedCar?.transmission || "",
      image: selectedCar?.image || null,
    });
    setModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const deleteCars = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await fetch(`https://realauto.limsa.uz/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) getCars();
      else throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(cars.length / itemsPerPage);
  const paginatedCars = cars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSubmit = async (carId) => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("brand", formData.brand);
    formDataToSubmit.append("model", formData.model);
    formDataToSubmit.append("city", formData.city);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("location", formData.location);
    formDataToSubmit.append("transmission", formData.transmission);
    if (formData.image) formDataToSubmit.append("image", formData.image);

    try {
      const url = carId
        ? `https://realauto.limsa.uz/api/cars/${carId}`
        : "https://realauto.limsa.uz/api/cars";
      const method = carId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("tokenchik")}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        alert(carId ? "Car updated successfully!" : "Car added successfully!");
        getCars(); // Reload cars after submitting
        setFormData({
          brand: "",
          model: "",
          city: "",
          category: "",
          location: "",
          transmission: "",
          image: null,
        }); // Reset form data
        setModal(false);
      } else {
        throw new Error("Failed to save car data.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the data.");
    }
  };

  useEffect(() => {
    getCars();
    getBrands();
    getModels();
    getCities();
    getCategories();
    getLocations();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <button className="button" onClick={() => setModal(true)}>
        Add New Car
      </button>

      <table id="customers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Transmission</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCars.map((item, index) => (
            <tr key={item.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.transmission}</td>
              <td>
                <img
                  src={`https://realauto.limsa.uz/api/uploads/images/${item?.car_images?.[0]?.image?.src}`}
                  alt={item.title || "Car Image"}
                  style={{ width: "40px" }}
                />
              </td>
              <td>
                <button onClick={() => handleModal(item.id)}>
                  <IoMdCreate />
                </button>
                <button onClick={() => deleteCars(item.id)}>
                  <IoClose />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
          <Box sx={style}>
            <h2 id="modal-title">{element ? "Edit Car" : "Add New Car"}</h2>
            <form>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.title}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_en}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                margin="normal"
              />

              <div>
                <label htmlFor="image">Car Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button variant="outlined" onClick={() => setModal(false)}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={() => handleSubmit(element?.id)}>
                  {element ? "Save Changes" : "Add Car"}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}

      <div className="pagination">
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Cars;
