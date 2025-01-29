// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const CarDetail = () => {
//   const { carId } = useParams();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCarDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/carDetail/${carId}`); // Adjust API endpoint
//         const data = await response.json();
//         setCar(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching car details:", error);
//         setLoading(false);
//       }
//     };

//     fetchCarDetails();
//   }, [carId]);

//   if (loading) {
//     return <div style={{ textAlign: "center", fontSize: "20px" }}>Loading...</div>;
//   }

//   if (!car) {
//     return <div style={{ textAlign: "center", fontSize: "20px", color: "red" }}>Car not found</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>{car.title}</h1>
//       <p style={styles.price}>${car.price}</p>
//       <p style={styles.description}>{car.detailDescription}</p>

//       <div style={styles.imageGallery}>
//         {car.photos.map((photo, index) => (
//           <img key={index} src={photo} alt={`Car ${index + 1}`} style={styles.image} />
//         ))}
//       </div>

//       <div style={styles.tagContainer}>
//         {car.tags.map((tag, index) => (
//           <span key={index} style={styles.tag}>
//             {tag}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "800px",
//     margin: "auto",
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "10px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//     textAlign: "center",
//   },
//   title: {
//     fontSize: "28px",
//     fontWeight: "bold",
//     marginBottom: "10px",
//     color: "#333",
//   },
//   price: {
//     fontSize: "22px",
//     fontWeight: "bold",
//     color: "#28a745",
//   },
//   description: {
//     fontSize: "16px",
//     color: "#555",
//     margin: "10px 0",
//   },
//   imageGallery: {
//     display: "flex",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: "10px",
//     marginTop: "15px",
//   },
//   image: {
//     width: "150px",
//     height: "100px",
//     objectFit: "cover",
//     borderRadius: "8px",
//     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
//   },
//   tagContainer: {
//     marginTop: "15px",
//     display: "flex",
//     justifyContent: "center",
//     gap: "10px",
//     flexWrap: "wrap",
//   },
//   tag: {
//     backgroundColor: "#007bff",
//     color: "white",
//     padding: "5px 10px",
//     borderRadius: "15px",
//     fontSize: "14px",
//   },
// };

// export default CarDetail;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CarDetail = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`https://car-management-app-spyne-backend.onrender.com/carDetail/${carId}`);
        const data = await response.json();
        setCar(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  if (loading) {
    return <div style={{ textAlign: "center", fontSize: "20px", padding: "20px", color: "#007bff" }}>Loading...</div>;
  }

  if (!car) {
    return <div style={{ textAlign: "center", fontSize: "20px", color: "red", padding: "20px" }}>Car not found</div>;
  }

  return (
    <div style={styles.container} >
      <h1 style={styles.title}>{car.title}</h1>
      <div style={styles.imageGallery}>
        {car.photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Car ${index + 1}`} style={styles.image} />
        ))}
      </div>
      <p style={styles.price}>${car.price}</p>
      <p style={styles.description}>{car.detailDescription}</p>


      <div style={styles.tagContainer}>
        {car.tags.map((tag, index) => (
          <span key={index} style={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "25px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    border: "2px solid #f0f0f0",
    backgroundColor:"ivory"
  },
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#222",
    textTransform: "uppercase",
  },
  price: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#28a745",
    backgroundColor: "#f4f4f4",
    display: "inline-block",
    padding: "8px 15px",
    borderRadius: "8px",
  },
  description: {
    fontSize: "17px",
    color: "#444",
    margin: "15px 0",
    lineHeight: "1.5",
  },
  imageGallery: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    marginTop: "20px",
  },
  image: {
    width: "160px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  tagContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "7px 14px",
    borderRadius: "18px",
    fontSize: "15px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    cursor: "pointer",
  },
};

// Hover Effects
styles.image[":hover"] = {
  transform: "scale(1.1)",
  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.4)",
};

styles.tag[":hover"] = {
  backgroundColor: "#0056b3",
  transform: "scale(1.1)",
};

export default CarDetail;
