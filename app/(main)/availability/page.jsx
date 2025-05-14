import React from "react";
import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";
import AvailabilityForm from "./_components/availabilityForm";



const AvailabilityPage = async () => {

  const availability = await getUserAvailability();

  console.log("Get user Availability Page :",availability); 
  
  // it gives null because we don't have any availability , if this i will return the default availability 

  return <AvailabilityForm initialData={availability || defaultAvailability} />;
};

export default AvailabilityPage;






/* In this we are supposed to fetch all of our availabilities, 

    - if no availability , then we gonna provide it a default data  and we have something called default availability

*/
