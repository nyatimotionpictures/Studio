import React, { ElementType, ReactNode, useContext } from "react";
import Button, { buttonStyles } from "../Buttons/Button.tsx";
import { twMerge } from "tailwind-merge";
import { useSidebarContext } from "../../5-Store/SidebarContext.tsx";
import { PageHeaderFirstSection } from "./PageHeader.tsx";
import CustomStack from "../Stacks/CustomStack.jsx";
import { Avatar, Typography } from "@mui/material";
import Logo from "../../1-Assets/logos/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../5-Store/AuthContext.jsx";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { postAuthLogout } from "../../5-Store/TanstackStore/services/api.ts";

{
  /** small sidebar --- starts here */
}
type SmallSidebarItemProps = {
  Icon: string;
  title: string;
  url: string;
};

[
  /** items - smallbarItems */
];
const SmallSidebarItem = ({ Icon, title, url }: SmallSidebarItemProps) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        twMerge(
          buttonStyles({ variant: "ghost" }),
          `py-4 px-1 flex flex-col items-center text-whites-500 rounded-lg gap-1 ${
            isActive
              ? "font-bold bg-tertiary-40 hover:bg-tertiary-40 text-primary-500"
              : undefined
          }`
        )
      }
    >
      <span className={`${Icon} w-6 h-6 `} />
      <div className="text-xs">{title}</div>
    </NavLink>
  );
};

type LargeSidebarSectionProps = {
  children: ReactNode;
  title?: string;

  visibleItemCount?: number;
};

[
  /** items - smallbarItems */
];

const LargeSidebarSection = ({
  children,
  title,
  visibleItemCount = Number.POSITIVE_INFINITY,
}: LargeSidebarSectionProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const childrenArray = React.Children.toArray(children).flat();
  const showExpandButton = childrenArray.length > visibleItemCount;
  const visibleChildren = isExpanded
    ? childrenArray
    : childrenArray.slice(0, visibleItemCount);

  const ButtonIcon = isExpanded
    ? "icon-[solar--alt-arrow-up-broken]"
    : "icon-[solar--alt-arrow-down-broken]";

  return (
    <div className="flex flex-col gap-3 flex-1">
      {title && <div className="ml-4 mt-2 text-lg mb-1">{title}</div>}
      {visibleChildren}
      {showExpandButton && (
        <Button
          onClick={() => setIsExpanded((e) => !e)}
          variant="ghost"
          className="w-full flex items-center rounded-lg gap-4 p-3"
        >
          <span className={`${ButtonIcon} w-6 h-6 text-whites-200`} />
          <div>{isExpanded ? "Show Less" : "Show More"}</div>
        </Button>
      )}
    </div>
  );
};

[
  /** items - LargebarItems */
];
type LargeSidebarItemProps = {
  Icon: ElementType | string;
  title: string;
  url: string;
  isActive?: boolean;
};

const LargeSidebarItem = ({ Icon, title, url }: LargeSidebarItemProps) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        twMerge(
          buttonStyles({ variant: "ghost" }),
          `w-full flex items-center rounded-lg gap-4 p-3 text-whites-200 hover:text-primary-500 hover:font-bold hover:bg-tertiary-40 ${
            isActive
              ? "font-bold bg-tertiary-40 hover:bg-tertiary-40 text-primary-500"
              : undefined
          }`
        )
      }
    >
      <span className={`${Icon} w-6 h-6  hover:text-primary-500 `} />
      <div className="whitespace-nowrap  overflow-hidden text-ellipsis hover:text-primary-500 ">
        {title}
      </div>
    </NavLink>
  );
};

const Sidebar = () => {
  let navigate = useNavigate();
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  const userData = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = React.useState(null);
  const queryClient = new QueryClient();
  React.useEffect(() => {
    if (userData.currentUser !== null) {
      setCurrentUserData(userData.currentUser?.user);
    } else {
      navigate("/login", { replace: true });
    }
    //console.log("userData", userData);
  
  }, [userData.currentUser?.user.id]);

  const mutation = useMutation({
    mutationFn: postAuthLogout,
    onSuccess: (data) => {
      queryClient.clear();
      localStorage.clear();
      //localStorage.removeItem("user");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      // setErroressage(()=> `Login Failed: ${error.message}`)
    },
  });
  return (
    <>
      <aside
        className={`sticky top-0 overflow-y-auto scrollbar-hidden pb-4 flex flex-col ml-0 bg-secondary-800 h-full ${
          isLargeOpen ? "lg:hidden" : "lg:flex"
        }`}
      >
        <SmallSidebarItem
          Icon={"icon-[carbon--home]"}
          title={"Dashboard"}
          url={"/"}
        />
        <SmallSidebarItem
          Icon={"icon-[carbon--media-library]"}
          title="Content"
          url="/content"
        />
        <SmallSidebarItem
          Icon={"icon-[carbon--receipt]"}
          title="Subscriptions"
          url="/subscriptions"
        />
        <SmallSidebarItem
          Icon={"icon-[carbon--purchase]"}
          title="Donations"
          url="/donations"
        />

        <SmallSidebarItem
          Icon={"icon-[carbon--user-multiple]"}
          title="People"
          url="/people"
        />
         <SmallSidebarItem
            Icon={"icon-[carbon--cloud-service-management]"}
            title="Stream Settings"
            url="/streamsettings"
          />
        <SmallSidebarItem
          Icon={"icon-[carbon--settings]"}
          title="Account Settings"
          url="/setting"
        />
      </aside>

      {isSmallOpen && (
        <div
          onClick={close}
          className="lg:hidden fixed inset-0 z-[999] bg-secondary-600 opacity-50"
        />
      )}
      <aside
        className={`w-56 lg:sticky absolute  top-0  overflow-x-hidden overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2 bg-secondary-800 h-full  ${
          isLargeOpen ? "lg:flex" : "lg:hidden"
        } ${isSmallOpen ? "flex z-[999] bg-white max-h-screen" : "hidden"}`}
      >
        <div className=" pt-2 pb-4 px-2 sticky top-0 bg-white ">
          {/**  <PageHeaderFirstSection hidden={false} />*/}

          <img src={Logo} alt="" />
        </div>
        <LargeSidebarSection>
          <LargeSidebarItem
            Icon={"icon-[carbon--home]"}
            title={"Dashboard"}
            url={"/"}
          />
          <LargeSidebarItem
            Icon={"icon-[carbon--media-library]"}
            title={"Content Repository"}
            url={"/content"}
          />
          <LargeSidebarItem
            Icon={"icon-[carbon--receipt]"}
            title="Subscriptions"
            url="/subscriptions"
          />
          <LargeSidebarItem
            Icon={"icon-[carbon--purchase]"}
            title="Donations"
            url="/donations"
          />
          <LargeSidebarItem
            Icon={"icon-[carbon--user-multiple]"}
            title="People"
            url="/people"
          />
           <LargeSidebarItem
            Icon={"icon-[carbon--cloud-service-management]"}
            title="Stream Settings"
            url="/streamsettings"
          />
          <LargeSidebarItem
            Icon={"icon-[carbon--settings]"}
            title="Account Settings"
            url="/setting"
          />
        </LargeSidebarSection>

        <div className="flex w-fit overflow-hidden">
          <CustomStack className="border-t-2 border-whites-700 pt-3 pb-3 flex-col  items-center gap-4">
            <CustomStack className="gap-2 w-full">
              <Avatar
                sx={{ bgcolor: "white" }}
                className="bg-primary-300 w-13 h-13"
                alt={`${
                  currentUserData !== null && currentUserData?.lastname
                    ? currentUserData.lastname
                    : ""
                } ${
                  currentUserData !== null && currentUserData?.firstname
                    ? currentUserData.firstname
                    : ""
                } `}
                src="/broken-image.jpg"
              />
              <div className="flex flex-col gap-[0] text-[#f2f2f2] font-[Inter-Bold] ">
                <h1>
                  {currentUserData !== null && currentUserData?.lastname
                    ? currentUserData?.lastname
                    : ""}{" "}
                  {currentUserData !== null && currentUserData?.firstname
                    ? currentUserData.firstname
                    : ""}
                </h1>
                <p className="w-2/2 truncate text-[10px]  flex flex-col ">
                  {currentUserData !== null && currentUserData?.email
                    ? currentUserData.email
                    : ""}{" "}
                </p>
              </div>
            </CustomStack>

            <div className="flex w-full overflow-hidden">
              <Button disabled={mutation.isPending ? true : false}  onClick={() => mutation.mutate(
                currentUserData && currentUserData.id ? currentUserData.id : null
              )} className="w-full p-2 flex flex-row items-center justify-center  gap-4 text-base bg-secondary-500 m-0 rounded-lg">
                
                {
                  mutation.isPending ?  <p>Loader..</p> :  <span className="icon-[solar--logout-outline] w-6 h-6"></span>
                }
                {
                  mutation.isPending ?  <p>Logging out</p> :  <p>Logout</p>
                }
               
              </Button>
            </div>
          </CustomStack>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
