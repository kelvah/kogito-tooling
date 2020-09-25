import * as React from "react";
import { v4 as uuid } from "uuid";
import SkeletonStripe from "../SkeletonStripe/SkeletonStripe";
import "./SkeletonCard.scss";

const SkeletonCard = () => {
  return (
    <div className="skeleton-cards__card">
      <SkeletonStripe key={uuid()} customStyle={{ width: 250, height: 20, marginBottom: "20px" }} />
      <SkeletonStripe key={uuid()} customStyle={{ width: 120, height: 20 }} />
    </div>
  );
};

export default SkeletonCard;
