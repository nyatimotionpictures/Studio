import moment from "moment-timezone";
import React from "react";

const ViewSeasonDetails = ({ film, season }) => {
  console.log(season)
  return (
    <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
      {/** Season Number && Title */}
      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Season Number
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            {season?.season}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Season Title
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            {season?.title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Number of Episodes
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            {season?.episodes?.length}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Created At
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            { moment(film?.createdAt).format("DD/MMM/YYYY - hh:mm:ss a")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewSeasonDetails;
