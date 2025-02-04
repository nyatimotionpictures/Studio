import React from "react";
import { Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import EpisodesListTable from "../Tables/EpisodesListTable";
import SeasonDetails from "../Forms/SeasonDetails";
import ThumbnailTab from "./ThumbnailTab";
import TrailerTab from "./TrailerTab";
import AudienceTab from "./AudienceTab";
import PricingTab from "./PricingTab";
import SeasonAudienceTab from "./SeasonAudienceTab";

const displayTabs = [
  {
    title: "Episodes",
    position: "1",
  },
  {
    title: "Season/Segment Details",
    position: "2",
  },
  {
    title: "Audience, Visibility",
    position: "3",
  },
  {
    title: "Posters",
    position: "4",
  },
  {
    title: "Trailer",
    position: "5",
  },
  {
    title: "Pricing",
    position: "6",
  },
];

const SeasonTabs = ({ handleNewEpisode, film, season, type }) => {
  const [currentTabValue, setCurrentTabValue] = React.useState("1");

  const handleTabChange = (event, newValue) => {
    setCurrentTabValue(() => newValue);
  };

  //console.log("film", film);
  /** get season details */

  const TabDisplay = (datakey) => {
    switch (datakey) {
      case "Episodes":
        return (
          <EpisodesListTable
            handleNewEpisode={handleNewEpisode}
            season={season}
          />
        );
      case "Season/Segment Details":
        return <SeasonDetails film={film} season={season} />;
        case "Audience, Visibility":
          return <SeasonAudienceTab film={season} type={"season"} />;
      case "Posters":
        return <ThumbnailTab film={season} type={type} />;
      case "Trailer":
        return <TrailerTab film={season} type={type} />;
        case "Pricing":
          return <PricingTab film={season} type={type} />;
      default:
        break;
    }
  };
  return (
    <div className="min-h-[60vh]">
      {displayTabs?.length > 0 && (
        <TabContext value={currentTabValue !== null && currentTabValue}>
          <div className="flex flex-col justify-end space-x-5    p-0 box-border bg-transparent relative">
            <hr className=" absolute -bottom-0 h-[1px] border-[transparent]  border-b-[0.1px] border-b-[#ee5170]   w-full z-10" />
            <Tabs
              value={currentTabValue !== null && currentTabValue}
              onChange={handleTabChange}
              indicatorColor=""
              sx={{ margin: "0px" }}
            >
              {displayTabs.map((data) => {
                return (
                  <Tab
                    className={`  font-[Inter-Regular] ${
                      currentTabValue !== null &&
                      currentTabValue === data.position
                        ? "!scale-100 text-whites-50 !border-b-2 !border-b-transparent z-40"
                        : "scale-75 text-primary-500 text-opacity-75"
                    }  translate-y-2 text-sm mx-2`}
                    key={data.position}
                    value={data.position}
                    label={data.title}
                    sx={
                      currentTabValue !== null &&
                      currentTabValue === data.position
                        ? {
                            border: "2px solid #ee5070 !important",
                            backgroundColor: "#24222a",
                            borderBottom: "0px !important",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                          }
                        : {
                            border: "1px solid #424148 !important",
                            borderBottom: "0px",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                          }
                    }
                  />
                );
              })}
            </Tabs>
          </div>

          {displayTabs.map((data) => {
            return (
              <TabPanel key={data.position} value={data.position}>
                {TabDisplay(data.title)}
              </TabPanel>
            );
          })}
        </TabContext>
      )}
    </div>
  );
};

export default SeasonTabs;
