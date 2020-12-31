import React from "react";

import "./dashboardTheaters.css";
import Card from "../../shared/components/UI/card";

const DashboardTheater = ({ name, totalShows }) => {
  console.log(name);
  return (
    <Card>
      <li className="user-li">
        <h5>Theater Name: {name}</h5>
        <h6>Total Shows: {totalShows}</h6>
      </li>
    </Card>
  );
};

export default DashboardTheater;
