import { Typography } from "@mui/material";
import React from "react";

const CustomRatingButton = ({
  ratedId,
  btntitle,
  radiogroupName,
  btnText,
  btnImg,
}) => {
  return (
    <label
      htmlFor={ratedId}
      className="flex flex-col relative h-40 bg-[#E5E7EB]  text-secondary-900 rounded-lg w-80 p-4 gap-0"
    >
      <div className="flex items-center h-5 w-full justify-between">
        <Typography className="font-[Inter-Medium] text-base uppercase">
          {btntitle}
        </Typography>
        <input name={radiogroupName} type="radio" id={ratedId} />
      </div>

      <div className="h-11">
        <img className="h-full" src={btnImg} alt="" />
      </div>

      <Typography>{btnText}</Typography>
    </label>
  );
};

export default CustomRatingButton;
