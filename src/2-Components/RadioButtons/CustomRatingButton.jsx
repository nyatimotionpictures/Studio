import { Typography } from "@mui/material";
import React from "react";

const CustomRatingButton = ({
  ratedId,
  btntitle,
  radiogroupName,
  btnText,
  btnImg,
  handleChange,
  value,
  checked,
}) => {
  return (
    <label
      htmlFor={ratedId}
      className="flex flex-col  relative h-44 bg-[#E5E7EB]  text-secondary-900 rounded-lg min-w-80 w-max p-4 gap-3"
    >
      <div className="flex items-center h-5 w-full justify-between">
        <Typography className="font-[Inter-Medium] text-sm uppercase">
          {btntitle}
        </Typography>
        <input checked={checked} onChange={(e) => {
         handleChange("audienceAgeGroup", ratedId)
        }} name={radiogroupName} value={value} type="radio" id={ratedId} />
      </div>

      <div className="h-[45px] w-[133px] relative overflow-hidden">
        <img className="h-full w-full object-contain" src={btnImg} alt="" />
      </div>

      <Typography className="font-[Inter-Bold] text-xs w-[289px]">
        {btnText}
      </Typography>
    </label>
  );
};

export default CustomRatingButton;
