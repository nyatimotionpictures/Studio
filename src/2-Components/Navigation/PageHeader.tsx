import React from "react";
import { useSidebarContext } from "../../5-Store/SidebarContext.tsx";
import  Logo from '../../1-Assets/logos/Logo.png'
import Button from "../Buttons/Button.tsx";


type PageHeaderFirstSectionProps = {
  hidden?: boolean;
};

export function PageHeaderFirstSection({
  hidden = false,
}: PageHeaderFirstSectionProps) {
  const { toggle } = useSidebarContext();

  return (
    <div
      className={`gap-4 items-center flex-shrink-0 ${
        hidden ? "hidden" : "flex"
      }`}
    >
      <Button onClick={toggle} variant={"ghost"} size="icon">
        <span className="icon-[solar--hamburger-menu-broken]" />
      </Button>
      <a
        href="/"
        className="flex gap-2 items-center justify-center font-bold h-6 text-pink-700 text-xl"
      >
        <img src={Logo} alt="" className="h-8" />
        <h1>Nyati</h1>
      </a>
    </div>
  );
}
