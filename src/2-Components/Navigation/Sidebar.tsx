import React, { ElementType, ReactNode } from 'react'
import Button, { buttonStyles } from '../Buttons/Button.tsx'
import { twMerge } from 'tailwind-merge'
import { useSidebarContext } from '../../5-Store/SidebarContext.tsx';
import { PageHeaderFirstSection } from './PageHeader.tsx';
import CustomStack from '../Stacks/CustomStack.jsx';
import { Avatar, Typography } from '@mui/material';
import Logo from "../../1-Assets/logos/Logo.png";
import { NavLink } from 'react-router-dom';


{/** small sidebar --- starts here */}
type SmallSidebarItemProps = {
  Icon: string;
  title: string;
  url: string;
};

[/** items - smallbarItems */]
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
}

type LargeSidebarSectionProps = {
  children: ReactNode;
  title?: string;

  visibleItemCount?: number;
}

[
  /** items - smallbarItems */
];

const LargeSidebarSection = ({ children, title, visibleItemCount = Number.POSITIVE_INFINITY }: LargeSidebarSectionProps) => {
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
           <span
             className={`${ButtonIcon} w-6 h-6 text-whites-200`}
             
           />
           <div>{isExpanded ? "Show Less" : "Show More"}</div>
         </Button>
       )}
     </div>
   );
}

[/** items - LargebarItems */]
type LargeSidebarItemProps = {
  Icon: ElementType | string;
  title: string;
  url: string;
  isActive?: boolean;
}

const LargeSidebarItem = ({ Icon, title, url}: LargeSidebarItemProps) => {
  return (
    <NavLink
      to={url}
      className={({isActive})=>twMerge(
        buttonStyles({ variant: "ghost" }),
        `w-full flex items-center rounded-lg gap-4 p-3 text-whites-200 hover:text-primary-500 hover:font-bold hover:bg-tertiary-40 ${
          isActive
            ? "font-bold bg-tertiary-40 hover:bg-tertiary-40 text-primary-500"
            : undefined
        }`
      )}
    >
      <span className={`${Icon} w-6 h-6  hover:text-primary-500 `} />
      <div className="whitespace-nowrap  overflow-hidden text-ellipsis hover:text-primary-500 ">
        {title}
      </div>
    </NavLink>
  );
}

const Sidebar = () => {

  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
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
        className={`w-56 lg:sticky absolute  top-0 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2 bg-secondary-800 h-full  ${
          isLargeOpen ? "lg:flex" : "lg:hidden"
        } ${isSmallOpen ? "flex z-[999] bg-white max-h-screen" : "hidden"}`}
      >
        <div className=" pt-2 pb-4 px-2 sticky top-0 bg-white">
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
            Icon={"icon-[carbon--settings]"}
            title="Account Settings"
            url="/setting"
          />
        </LargeSidebarSection>

        <div className="flex">
          <CustomStack className="border-t-2 border-whites-700 pt-3 pb-3 flex-row space-x-4 items-center">
            <CustomStack className="space-x-4">
              <Avatar
                sx={{ bgcolor: "white" }}
                className="bg-primary-300 w-13 h-13"
                alt="JK"
                src="/broken-image.jpg"
              />
              <div className="flex flex-col gap-[0] text-ellipsis text-[#f2f2f2] text-[Inter-Bold]">
                <Typography>Esther Howard</Typography>
                <Typography>-</Typography>
              </div>
            </CustomStack>
            <div className="text-[#f2f2f2] text-md ">
              <span className="icon-[solar--menu-dots-linear] w-6 h-6"></span>
            </div>
          </CustomStack>
        </div>
      </aside>
    </>
  );
}

export default Sidebar