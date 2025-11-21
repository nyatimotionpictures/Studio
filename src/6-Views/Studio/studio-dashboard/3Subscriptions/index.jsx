import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Box, Typography } from "@mui/material";
import Button from "../../../../2-Components/Buttons/Button.tsx";
import { useNavigate } from "react-router-dom";

import sdIcon from '../../../../1-Assets/icons/sd-resolution.svg'
import hdIcon from '../../../../1-Assets/icons/hd-resolution.svg'
import fullhdIcon from '../../../../1-Assets/icons/fullhd-resolution.svg'
import ultrahdIcon from '../../../../1-Assets/icons/ultrahd-resolution.svg'
import SubscriptionTable from "../../../../2-Components/Tables/SubscriptionTable.jsx";
import { useGetPurchases } from "../../../../5-Store/TanstackStore/services/queries.ts";
import { Tab, Tabs } from "@mui/material"
import { TabContext, TabPanel } from '@mui/lab'
import SubscriptionFailedListTable from "../../../../2-Components/Tables/SubscriptionFailedListTable.jsx";

const displayTabs = [
  {
    title: "Pending/Success",
    position: "1"
  },
  {
    title: "Failed",
    position: "2"
  }
]

const Subscriptions = () => {
  const [currentTabValue, setCurrentTabValue] = React.useState('1')
  let navigate = useNavigate();

  const [statsArray, setStatsArray] = useState([
    {
      title: "Total Paid Subscriptions",
      stats: "UGX 0",
      icon: false,
    },
  ]);

  let getallpurchases = useGetPurchases();


  // console.log('purchases', getallpurchases.data)

  useEffect(() => {
    if (getallpurchases.data) {
      let successPurchases = [];

      const filterPurchases = getallpurchases.data?.transactions?.filter((data) => {

        if (data.status.includes("SUCCESS")) {
          successPurchases.push(parseFloat(data.amount))
        }
      }) ?? [];



      const ReducerPurchases = successPurchases?.length > 0 ? successPurchases?.reduce((sum, price) => sum + price, 0) : 0;


      setStatsArray(() => [
        {
          title: "Total Paid Subscriptions",
          stats: `UGX ${getallpurchases.data?.totalAmount || ReducerPurchases}`,

          icon: false,
        }

      ])
    }
  }, [getallpurchases.data])

  //handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTabValue(() => newValue);
  }

  const TabDisplay = (datakey) => {
    switch (datakey) {
      case "Pending/Success":
        return <SubscriptionTable transactions={getallpurchases?.data?.transactions} />
      case "Failed":
        return <SubscriptionFailedListTable transactions={getallpurchases?.data?.failedtransactions} />
      default:
        break;
    }
  }





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
              Subscriptions
            </Typography>


          </CustomStack>

          {/** Shortcuts */}
          {/* <div className="flex gap-9 mt-1">
            {
              subCategories.map((data) => (
                <div  key={data.ref} className="flex flex-col gap-3 w-[194px] py-[21px] px-[28px] bg-[#36323E] rounded-md ring-1 ring-[#EEF1F4] ring-opacity-30 cursor-pointer select-none hover:bg-opacity-20 text-center">
                  <div className="h-[70px] w-full flex justify-center items-center">
                    <img src={data.icon} alt="" className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-[214px] justify-between">
                    <h1 className="text-whites-40  text-xl font-bold">{data.price}</h1>
                  </div>
                  <Button className="font-medium font-[Inter-Medium] text-sm rounded-md">
                    UPDATE PRICE
                  </Button>
                </div>
              ))
            }

          </div> */}
          {/** Stats */}
          <div className="flex gap-3 divide-x divide-secondary-600 mt-3">
            {statsArray.map((data, index) => {
              return (
                <Box key={index} className="px-8 py-3.5 flex flex-col justify-center ">
                  <CustomStack className="gap-4 items-center">
                    <Typography className="font-[Inter-Medium] text-ellipsis text-whites-50 text-3xl">
                      {data.stats}
                    </Typography>

                    {data.icon ? (
                      <Button
                        size="icon"
                        className="bg-secondary-800 rounded-md w-10 h-8"
                      >
                        <span className="icon-[solar--arrow-up-linear] text-[#1E8B51] w-5 h-5"></span>
                      </Button>
                    ) : (
                      <span className="w-10 h-8"></span>
                    )}
                  </CustomStack>
                  <Typography className="font-[Inter-Regular] text-ellipsis text-secondary-200 text-base pt-2">
                    {data.title}
                  </Typography>
                </Box>
              );
            })}
          </div>

          {/** Tabs */}
          {
            displayTabs?.length > 0 && (
              <TabContext value={currentTabValue !== null && currentTabValue}>
                <div className="flex flex-col justify-end space-x-5    p-0 box-border bg-transparent relative">
                  <hr className=' absolute -bottom-0 h-[1px] border-[transparent]  border-b-[0.1px] border-b-[#ee5170]   w-full z-10' />
                  <Tabs value={currentTabValue !== null && currentTabValue} onChange={handleTabChange} indicatorColor='' sx={{ margin: "0px", }} >
                    {displayTabs.map((data) => {
                      return (
                        <Tab className={`  font-[Inter-Regular] ${currentTabValue !== null && currentTabValue === data.position ? "!scale-100 text-whites-50 !border-b-2 !border-b-transparent z-40" : "scale-75 text-primary-500 text-opacity-75"}  translate-y-2 text-sm mx-2`} key={data.position} value={data.position} label={data.title} sx={currentTabValue !== null && currentTabValue === data.position ? { border: "2px solid #ee5070 !important", backgroundColor: "#24222a", borderBottom: "0px !important", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } : { border: "1px solid #424148 !important", borderBottom: "0px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }} />
                      )
                    })}
                  </Tabs>
                </div>

                {/** table */}
                <div className="pt-7 pb-11 ">
                  {/* <VideoListTable /> */}

                  {/* <SubscriptionTable transactions={getallpurchases?.data?.transactions} /> */}

                  {
                    displayTabs.map((data) => {
                      return (
                        <TabPanel key={data.position} value={data.position}>
                          {TabDisplay(data.title)}
                        </TabPanel>
                      )
                    })
                  }
                </div>
              </TabContext>
            )
          }
          <div>

          </div>


        </div>
      </div>


    </div>
  )
}

export default Subscriptions