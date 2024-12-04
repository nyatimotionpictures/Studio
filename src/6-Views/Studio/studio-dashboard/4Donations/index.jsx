import React, { useEffect, useState } from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import donateMobileIcon from '../../../../1-Assets/icons/mobile-donations.svg'
import donateWebsiteIcon from '../../../../1-Assets/icons/website-donations.svg'
import DonationsTable from "../../../../2-Components/Tables/DonationsTable.jsx";
import { useGetDonations } from "../../../../5-Store/TanstackStore/services/queries.ts";

const Donations = () => {
  
  let navigate = useNavigate();
  const [donateState, setDonateState] = useState("App Donations");

  const [donateTotals, setDonateTotals] = useState([
    {
      title: "App Donations",
      amount: "UGX 0",
      desc: "Donations collected from the Apps",
      icon: donateMobileIcon,
      table:"AppDonations"
    },
    {
      title: "Web Donations",
      amount: "UGX 0",
      desc: `Donations collected from Websites`,
      icon: donateWebsiteIcon,
      table: 'WebDonations'
    }
  ])



  // function useGet

 let getalldonations = useGetDonations();

  //console.log("all data", getalldonations.data)

/** useEffect to get total amount of app donations and web donations */
  useEffect(() => {
    if(getalldonations.data) {
      let AppDonations = [];
      let WebDonations = [];
      const filterAppDonations =   getalldonations.data?.appDonations?.filter((data) =>{

        if (data.status.includes("success")){
          AppDonations.push(parseFloat(data.amount))
        }
      }  ) ?? [];
      const filterWebDonations = getalldonations.data?.webDonations?.filter((data) =>{

        if (data.payment_status_description.includes("success")){
          WebDonations.push(parseFloat(data.amount))
        }
      }  ) ?? [];
      const ReducerAppDonations = AppDonations?.length > 0 ?  AppDonations?.reduce((sum, price) => sum + price, 0  ) : 0;
      const ReducerWebDonations = WebDonations?.length > 0 ?  WebDonations?.reduce((sum, price) => sum + price, 0  ) : 0;
   
      setDonateTotals(()=> [
        {
          title: "App Donations",
          amount: `UGX ${ReducerAppDonations}`,
          desc: "Donations collected from the Apps",
          icon: donateMobileIcon,
          table:"AppDonations"
        },
        {
          title: "Web Donations",
          amount:`UGX ${ReducerWebDonations} `,
          desc: `Donations collected from Websites`,
          icon: donateWebsiteIcon,
          table: 'WebDonations'
        }
      ])
    }
  }, [getalldonations.data])

  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        {/** content */}
        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** head title */}
          <CustomStack className="bg-[#24222a] z-40 w-full justify-between items-center py-6 sticky top-0">
            <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
              Donations
            </Typography>


          </CustomStack>

          {/** Shortcuts */}
          <div className="flex gap-9 mt-1">
            {
              donateTotals.map((data, index) => (
                <div onClick={() => data.table === "AppDonations" ? setDonateState("App Donations"): setDonateState("Web Donations")} key={index} className="flex flex-row gap-3 h-[126px] py-[21px] px-[28px] bg-[#36323E] rounded-md ring-1 ring-[#EEF1F4] ring-opacity-30 cursor-pointer select-none hover:bg-opacity-20">
                  <div className="h-[83px] bg-whites-50 rounded-md w-[83px] flex justify-center items-center">
                    <img src={data.icon} alt="" className="w-[70.73px] h-[54,53px]" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[214px] justify-between">
                    <h1 className="text-whites-40  text-xl font-bold">{data.amount}</h1>
                    <p className="text-[#9E9D9D]">{data.desc}</p>
                  </div>
                </div>
              ))
            }

          </div>
          
         
          {/** table */}
          {
            donateState === "App Donations" ? (<div className="pt-7 pb-11 flex flex-col gap-4">
            {/* <VideoListTable /> */}
            <div className="font-[Inter-Medium] text-[#fafafa] text-xl">App Donations</div>
            <DonationsTable donations={getalldonations.data?.appDonations} type={donateState}   />
          </div> ): (
            <div className="pt-7 pb-11 flex flex-col gap-4">
            {/* <VideoListTable /> */}
            <div className="font-[Inter-Medium] text-[#fafafa] text-xl">Web Donations</div>
            <DonationsTable donations={getalldonations.data?.webDonations} type={donateState}  />
          </div>

          ) 
          }
          
        </div>
      </div>


    </div>
  )
}

export default Donations