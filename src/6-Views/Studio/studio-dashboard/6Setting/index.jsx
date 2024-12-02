import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../../2-Components/Navigation/Sidebar";
import CustomStack from "../../../../2-Components/Stacks/CustomStack";
import { Typography } from "@mui/material";
import AccountTabs from "../../../../2-Components/Tabs/AccountTabs";

const Setting = () => {
  let navigate = useNavigate();

  let params = useParams();
  const [isImgBroken, setIsImgBroken] = React.useState(false);
  const [filmId, setFilmId] = React.useState(null);
  //const filmsQuery = useGetFilm(params?.id);
  React.useEffect(() => {
    //setFilmId()
    //console.log("filmId", filmsQuery.data)
    setFilmId(() => params?.id);
  }, [params?.id]);

  const handleImgError = (e) => {
    setIsImgBroken(true);
  };

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** title */}
          <CustomStack className="bg-[#24222a] z-50 w-full justify-between items-start py-6 sticky top-0 flex-col">
            <div className="flex flex-row items-center gap-9">
              <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                Account Settings
              </Typography>
            </div>
          </CustomStack>

          {/** account tabs */}

          <div className="pt-7 pb-11 ">

            <div>

              <AccountTabs />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
