

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImCross } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { set } from 'mongoose';
import { CiSearch } from "react-icons/ci";



const LandingPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState("");
    const [price, setPrice] = useState("");
    const [tags, setTags] = useState("");
    const [detailDescription, setdetailDescription] = useState("");
    const [editingCar, setEditingCar] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCars, setFilteredCars] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            try {
                const user = JSON.parse(auth);
                if (user.result && user.result._id) {
                    setUserId(user.result._id);
                    setName(user.result.name || "User");
                } else {
                    console.error("User ID not found in localStorage data.");
                }
            } catch (err) {
                console.error("Failed to parse user data:", err);
            }
        } else {
            console.error("User not found in localStorage.");
        }
    }, []);

    useEffect(() => {
        const fetchCars = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`http://localhost:5000/cars/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCars(data);
            } catch (err) {
                setError("Failed to fetch cars. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [userId]);
    useEffect(() => {
        // Reset filteredCars when the cars list changes
        setFilteredCars(cars);
    }, [cars]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleDelete = async (carId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this car?");
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/deleteCar/${carId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the car');
            }

            alert('Car deleted successfully');
            setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
        } catch (err) {
            alert(err.message);
        }
    };
    const tagOptions = ['sedan', 'suv', 'sports', 'hatchback', 'coupe', 'convertible', 'minivan', 'truck'];

    const handleSave = async () => {
        if (!userId) {
            alert("User ID is missing. Please log in again.");
            return;
        }

        if (!title || !description || !photos || !price || !tags || !detailDescription) {
            alert("Please fill out all fields.");
            return;
        }

        const newCar = {
            userId,
            title,
            description,
            // photos: photos.split(",").map(photo => photo.trim()), // Trim spaces
            photos: photos
                .split(",")  // Split by commas
                .map(photo => photo.trim())  // Trim any leading/trailing spaces from each URL
                .filter(photo => photo && isValidUrl(photo)), // Filter out any empty strings and validate URLs
            price: parseFloat(price),
            tags,
            detailDescription
        };
        console.log(newCar)
        function isValidUrl(url) {
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        }

        try {
            const response = await fetch("http://localhost:5000/addCar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCar),
            });

            if (!response.ok) {
                throw new Error('Failed to add the car');
            }

            const data = await response.json();
            setCars((prevCars) => [...prevCars, data]);

            // Clear the form fields
            setTitle("");
            setDescription("");
            setPhotos("");
            setPrice("");
            setTags("");
            setdetailDescription("");

            alert("Car added successfully!");
        } catch (err) {
            alert(err.message);
        }
    };
    const handleEdit = (car) => {
        setEditingCar(car);
        setTitle(car.title);
        setDescription(car.description);
        setPhotos(car.photos.join(", "));
        setPrice(car.price);
        setTags(car.tags);
        setdetailDescription(car.detailDescription);
    };

    const handleEditCar = async () => {
        if (!title || !description || !photos || !price || !tags.length || !detailDescription) {
            alert("Please fill out all fields.");
            return;
        }

        const carData = {
            userId,
            title,
            description,
            photos: photos.split(",").map(photo => photo.trim()).filter(photo => photo),
            price: parseFloat(price),
            tags,
            detailDescription
        };

        try {
            const response = editingCar
                ? await fetch(`http://localhost:5000/updateCar/${editingCar._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(carData),
                })
                : await fetch("http://localhost:5000/addCar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(carData),
                });

            if (!response.ok) throw new Error('Failed to save the car');

            const updatedCar = await response.json();
            setCars((prevCars) => editingCar
                ? prevCars.map(car => car._id === editingCar._id ? updatedCar : car)
                : [...prevCars, updatedCar]);

            setTitle(""); setDescription(""); setPhotos(""); setPrice(""); setTags([]); setdetailDescription("");
            setEditingCar(null);
            alert(editingCar ? "Car updated successfully!" : "Car added successfully!");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = cars.filter((car) => {
            const query = e.target.value.toLowerCase();
            return (
                car.title.toLowerCase().includes(query) ||
                car.description.toLowerCase().includes(query) ||
                car.tags.some(tag => tag.toLowerCase().includes(query))
            );
        });
        setFilteredCars(filtered);
        // if(filtered.length === 0) {
        //     setFilteredCars(cars);
        // }
    };

    const validate1 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setbookName(e.target.value);
        // setbookName(e.target.value);
        setTitle(e.target.value);
    };

    const validate2 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
        // setauthor(e.target.value);
        setDescription(e.target.value);
    };

    const validate3 = (e) => { // dont let first character to be a space 
        // if (/^\s/.test(e.target.value))
        //     e.target.value = '';

        // setPrice(e.target.value);
        let value = e.target.value;

        // Prevent first character from being a space
        if (/^\s/.test(value)) {
            value = "";
        }

        // Allow only numbers (removes non-numeric characters)
        value = value.replace(/\D/g, "");

        setPrice(value);
    };

    const validate4 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
        // setphoto(e.target.value);
        setPhotos(e.target.value);
    };
    const validate5 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
        // setphoto(e.target.value);
        // setPhotos(e.target.value);
        setdetailDescription(e.target.value);
    };


    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ textAlign: "center", margin: "20px 0", color: "#007BFF", fontWeight: "bold" }}>Car List</h1>
                <h3 style={{ textAlign: "center", margin: "20px 0", color: "green" }}>Hello, {name}</h3>
                <div>
                    <button type="button" className="btn btn-danger mx-1" style={{ padding: "10px 20px", fontWeight: "bold" }} data-bs-toggle="modal" data-bs-target="#myModall">
                        Add Car
                    </button>
                    <button type="button" className="btn btn-warning" style={{ padding: "10px 20px", fontWeight: "bold" }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            {/* {error && <p style={{ textAlign: "center", fontSize: "20px", color: "red", marginTop: "50px" }}>{error}</p>} */}

            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: "#f1f1f1", borderRight: "none" }}>
                        <CiSearch size={20} />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search cars by title, description or tags"
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ borderLeft: "none" }} // Optionally remove left border
                    />
                </div>
            </div>

            {
                loading ? <div className="spinner-border text-success" role="status" style={{ height: "5rem", width: "5rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div> : filteredCars.length === 0 ? <h1 className="text-center">No cars available.</h1> :
                    <div className='row'>
                        {filteredCars.map((car) => (
                            <div className="col-md-4 d-flex align-items-stretch mb-4" key={car._id}>
                                <div className="card h-100" style={{ width: "18rem", margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
                                    <Link to={`/carDetail/${car._id}`} style={{ textDecoration: "none" }}>
                                        {/* <img src={car.photos[0] || "default-car.jpg"} alt={car.title} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} onError={(e) => e.target.src = "https://i.pinimg.com/474x/e3/2c/81/e32c8103d46f8c2f485097b055835ed7.jpg"} /> */}
                                        <div id={`carousel-${car._id}`} className="carousel slide carousel-fade" data-bs-ride="carousel">
                                            <div className="carousel-inner  ">
                                                {car.photos.map((photo, index) => (
                                                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                                        <img src={photo || "default-car.jpg"} className="d-block w-100" style={{ height: "200px", objectFit: "cover" }}
                                                            alt={`Car Image ${index + 1}`}
                                                            onError={(e) => e.target.src = "https://i.pinimg.com/474x/e3/2c/81/e32c8103d46f8c2f485097b055835ed7.jpg"} />
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Carousel Controls */}
                                            <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${car._id}`} data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${car._id}`} data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </Link>
                                    <div className="card-body d-flex flex-column" style={{ padding: "15px" }}>
                                        <h5 className="card-title">{car.title}</h5>
                                        <p className="card-text"><strong>Price:</strong> ${car.price}</p>
                                        <p className="card-text flex-grow-1"><strong>Description:</strong> {car.description}</p>
                                        <p className="card-text"><strong>Tags:</strong> {car.tags.join(", ")}</p>
                                        <div className="mt-auto">
                                            <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#carModal" onClick={() => handleEdit(car)}>
                                                Update
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(car._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            }
            <div className="modal fade" id="myModall" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ backgroundColor: "#c4afaf" }}>
                        <div className="modal-header">
                            <h1 className="modal-title" style={{ marginLeft: "auto", marginRight: "auto" }}>
                                New Car
                            </h1>
                            <button type="button" className="close" data-bs-dismiss="modal" style={{ border: "none" }}>
                                <ImCross />
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: "grid" }}>
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="text" value={title} onChange={validate1} placeholder="Enter Car Name" />
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="number" value={price} onChange={validate3} placeholder="Enter Car Price ($)" />
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="text" value={description} onChange={validate2} placeholder="Enter Car Overview/Summary" />
                            {/* <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Enter Car Tags (e.g., SUV, Automatic)" /> */}
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="text" value={photos} onChange={validate4} placeholder="Paste Car Image URL (comma-separated for multiple)" />
                            {/* <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="text" value={photos} onChange={(e) => setPhotos(e.target.value)} placeholder="Paste Car Image URL (comma-separated for multiple)" /> */}
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} className="login-form-input my-1" type="text" value={detailDescription} onChange={validate5} placeholder="Enter Car Detail Description" />
                            <select
                                multiple
                                value={tags}
                                onChange={(e) => {
                                    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
                                    setTags(selectedTags);
                                }}
                                className="form-select my-1"
                                style={{ border: "solid black", borderRadius: "15px" }}
                            >
                                {tagOptions.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-light" data-bs-dismiss="modal" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="carModal">
                <div className="modal-dialog">
                    <div className="modal-content bg-light">
                        <div className="modal-header" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h5 className="modal-title">{editingCar ? "Update Car" : "New Car"}</h5>
                            <button type="button" className="close" data-bs-dismiss="modal">
                                <ImCross />
                            </button>
                        </div>
                        <div className="modal-body">
                            <label><strong>Car Name</strong></label>
                            <input className="form-control my-2" type="text" value={title} onChange={validate1} placeholder="Car Name" />
                            <label><strong>Price</strong></label>
                            <input className="form-control my-2" type="number" value={price} onChange={validate3} placeholder="Car Price" />
                            <label><strong>Overview</strong></label>
                            <textarea className="form-control my-2" value={description} onChange={validate2} placeholder="Car Overview" />
                            <label><strong>Detail Description</strong></label>
                            <textarea className="form-control my-2" value={detailDescription} onChange={validate5} placeholder="Car detail description" />
                            <label><strong>Photos</strong></label>
                            <input className="form-control my-2" type="text" value={photos} onChange={validate4} placeholder="Car Image URLs (comma-separated)" />
                            <button className="btn btn-success w-100" data-bs-dismiss="modal" onClick={handleEditCar}>
                                {editingCar ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;