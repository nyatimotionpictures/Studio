import React, { useState } from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Box, Typography } from "@mui/material";
import Button from "../../../../2-Components/Buttons/Button.tsx";
import PeopleTable from "../../../../2-Components/Tables/PeopleTable.jsx";
import { useGetUsers } from "../../../../5-Store/TanstackStore/services/queries.ts";

const People = () => {
    const [statsArray, setStatsArray] = useState([
        {
            title: "Total Audience",
            stats: 0,
            icon: false,
        },
       
     
    ]);

    let getAllUserQuery = useGetUsers();

    React.useEffect(() => {
        if(getAllUserQuery.data) {
            
            setStatsArray(()=> [
                {
                    title: "Total Audience",
                    stats: getAllUserQuery.data?.users?.length ?? 0,
                    icon: false,
                },
               
            ])
        }
    }, [getAllUserQuery.data])


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
                         People
                      </Typography>

                     
                  </CustomStack>

                  {/** Stats */}
                  <div className="flex gap-3 divide-x divide-secondary-600 ">
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
                  {/** table */}
                  <div className="pt-7 pb-11 ">
                      {/* <VideoListTable /> */}
                      <PeopleTable users={getAllUserQuery.data?.users} />
                  </div>
              </div>
          </div>
          

      </div>
  )
}

export default People