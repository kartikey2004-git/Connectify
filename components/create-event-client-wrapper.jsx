import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import CreateEventDrawer from "./create-event";

const CreateEventDrawerClient = () => {
  return (
    <Suspense fallback={<BarLoader width={"100%"} color="currentColor" />}>
      <CreateEventDrawer />
    </Suspense>
  );
};

export default CreateEventDrawerClient;
