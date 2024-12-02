import React from 'react'
import { Tab, Tabs } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import UserTab from './UserTab';
import UserPasswordTab from './UserPasswordTab';

const displayTabs = [
    {
    title: "User Profile",
    position: "1"
},
    {
    title: "Password Settings",
    position: "2"
},
   
]

const AccountTabs = () => {
    const [currentTabValue, setCurrentTabValue] = React.useState("1");

    const handleTabChange = (event, newValue) => {
        setCurrentTabValue(() => newValue);
    };

    const TabDisplay = (datakey) => {
        switch (datakey) {
            case "User Profile":
                return <UserTab  />;
            case  "Password Settings":
                return <UserPasswordTab />;
            
            default:
                break;
        }
    }
  return (
    <div className="min-h-[60vh]">
    {displayTabs?.length > 0 && (
        <TabContext value={currentTabValue !== null && currentTabValue}>
            <div className="flex flex-col justify-end space-x-5    p-0 box-border bg-transparent relative">
                <hr className=' absolute -bottom-0 h-[1px] border-[transparent]  border-b-[0.1px] border-b-[#ee5170]   w-full z-10'/>
                <Tabs value={currentTabValue !== null && currentTabValue} onChange={handleTabChange} indicatorColor=''  sx={{ margin: "0px",    }} >
                    {displayTabs.map((data) => {
                        return (
                            <Tab className={`  font-[Inter-Regular] ${currentTabValue !== null && currentTabValue === data.position ? "!scale-100 text-whites-50 !border-b-2 !border-b-transparent z-40" : "scale-75 text-primary-500 text-opacity-50"}  translate-y-2 text-sm mx-2`} key={data.position} value={data.position} label={data.title} sx={currentTabValue !== null && currentTabValue === data.position ? { border: "2px solid #ee5070 !important", backgroundColor:"#24222a", borderBottom: "0px !important", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" } : { border: "1px solid #424148 !important", borderBottom: "0px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}} />
                    )
                })}
                </Tabs>
            </div>

            {
                displayTabs.map((data) => {
                    return (
                        <TabPanel key={data.position} value={data.position}>
                            {TabDisplay(data.title)}
                        </TabPanel>
                    )
                })
            }

        </TabContext>
)}
</div>
  )
}

export default AccountTabs