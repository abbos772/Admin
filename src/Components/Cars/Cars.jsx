import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { ToastContainer } from "react-toast";
import { IoMdCreate } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const style = {
  position: "absolute",
  top: "10%",
  left: "50%",
  transform: "translate(-50%, -10%)",
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
    brand_id: "",
    model_id: "",
    city_id: "",
    category_id: "",
    location_id: "",
    transmission: "",
    num_seats: "",
    fuel_type: "",
    engine_capacity: "",
    mileage: "",
    year: "",
    image1: null,
    image2: null,
    image3: null,
    max_speed: 120,
    max_people: 4,
    price_in_aed: "",
    price_in_usd: "",
    color: "",
  });

  const token = localStorage.getItem("tokenchik");

  const fields = [
    { name: "brand_id", label: "Brand", options: brands },
    { name: "model_id", label: "Model", options: models },
    { name: "city_id", label: "City", options: cities },
    { name: "category_id", label: "Category", options: categories },
    { name: "location_id", label: "Location", options: locations },
    { name: "transmission", label: "Transmission" },
    { name: "num_seats", label: "Number of Seats" }, 
    { name: "fuel_type", label: "Fuel Type" },
    { name: "engine_capacity", label: "Engine Capacity" },
    { name: "mileage", label: "Mileage" },
    { name: "year", label: "Year" },
    { name: "price_in_aed", label: "Price in AED" },
    { name: "price_in_usd", label: "Price in USD" },
    { name: "color", label: "Color" },
  ];

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
      brand_id: selectedCar?.brand_id || "",
      model_id: selectedCar?.model_id || "",
      city_id: selectedCar?.city_id || "",
      category_id: selectedCar?.category_id || "",
      location_id: selectedCar?.location_id || "",
      transmission: selectedCar?.transmission || "",
      num_seats: selectedCar?.num_seats || "",
      fuel_type: selectedCar?.fuel_type || "",
      engine_capacity: selectedCar?.engine_capacity || "",
      mileage: selectedCar?.mileage || "",
      year: selectedCar?.year || "",
      price_in_aed: selectedCar?.price_in_aed || "",
      price_in_usd: selectedCar?.price_in_usd || "",
      color: selectedCar?.color || "",
      image1: null,
      image2: null,
      image3: null,
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

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        [`image${index}`]: file,
      }));
    }
  };

  const handleSubmit = async (carId) => {
    const formDataToSubmit = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const url = carId
        ? `https://realauto.limsa.uz/api/cars/${carId}`
        : "https://realauto.limsa.uz/api/cars";
      const method = carId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        alert(carId ? "Car updated successfully!" : "Car added successfully!");
        getCars();
        setModal(false);
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert(`Error: ${errorData.message || "Failed to save car data."}`);
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
          {cars.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
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
        <Modal open={modal} onClose={() => setModal(false)}>
          <Box sx={style}>
            <h2>{element ? "Edit Car" : "Add New Car"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(element?.id);
              }}
            >
              {fields.map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  margin="normal"
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  select={!!field.options}
                  SelectProps={{ native: true }}
                >
                  {field.options && (
                    <>
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name || option.title || option.text || option.name_en || option.name_ru}
                        </option>
                      ))}
                    </>
                  )}
                </TextField>
              ))}
              <input type="file" onChange={(e) => handleImageChange(e, 1)} accept="image/*" />
              <input type="file" onChange={(e) => handleImageChange(e, 2)} accept="image/*" />
              <input type="file" onChange={(e) => handleImageChange(e, 3)} accept="image/*" />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {element ? "Update Car" : "Add Car"}
              </Button>
            </form>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Cars;
