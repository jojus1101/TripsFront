// Main page for trips. It will show a list of trips and a dropdown to filter by category.

import { Outlet} from "react-router-dom";
import facade from "../../apiFacade";
import { useEffect, useState } from "react";
import Title from "../baseElements/Title";
import CustomDropdown from "./CustomDropDown";
import TripItem from "./TripItem";
import  { TripPane, TripContainer, CardContainer } from "./StyledComps";


const TripList = ({ trips, colors, setCategory }) => {
  while (colors.length < trips.length) {
    colors = colors.concat(colors);
  }
  
  const handleSelect = (option) => {
    setCategory(option);
  }

  return (
    <TripPane>
      <Title titleText="Amazing trips" />
      <CustomDropdown
        options={["beach", "city", "forest", "lake", "sea", "snow"]}
        onSelect={handleSelect}
      />
      <CardContainer>
        {trips.map((trip, idx) => (
          <TripItem trip={trip} key={trip.id} backgroundcolor={colors[idx]} />
        ))}
      </CardContainer>
    </TripPane>
  );
};


// 
const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [tripsToShow, setTripsToShow] = useState([]);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const colors = ["#e0f7fa", "#e6f7e6", "#ffe0e9", "#f3e5f5"]; // soft blue, pale green, pastel pink, light lavender

  useEffect(() => { // Get initial list of trips
    (async () => {
      try {
        await facade.fetchAny("trips", (data)=>{setTrips(data); setTripsToShow(data);}, setError);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    })();
  }, []);

  useEffect(() => { // Drop down filter for selecting trips by category
    if(category.length > 0) {
      setTripsToShow(trips.filter(trip => trip.category === category.toUpperCase()));
    }
  }, [category]);

  return (
    <TripContainer>
      {error && <h1>{error}</h1>}
      <TripList trips={tripsToShow} colors={colors} setCategory={setCategory}/>
      <Outlet /> {/* Outlet is for Trip Details here */}
    </TripContainer>
  );
};


export {
  Trips
};
