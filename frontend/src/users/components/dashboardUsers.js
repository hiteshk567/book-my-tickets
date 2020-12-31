import React from "react";

import "./dashboardUsers.css";
import Card from "../../shared/components/UI/card";

const DashboardUsers = ({ name, seats }) => {
  console.log(name, seats);
  return (
    <Card>
      <li className="user-li">
        <h5>User Name: {name}</h5>
        <h6>Total tickets bought: {seats.length}</h6>
      </li>
    </Card>
  );
};

export default DashboardUsers;
