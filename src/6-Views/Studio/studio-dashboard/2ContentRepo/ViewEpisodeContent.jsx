import React from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import { Box, Typography } from "@mui/material";
import FilmDetailTab from "../../../../2-Components/Tabs/FilmDetailTab.jsx";
import { useParams } from "react-router-dom";
import { useGetFilm } from "../../../../5-Store/TanstackStore/services/queries.ts";
import NoImage from "../../../../1-Assets/no-image.svg"

const ViewEpisodeContent = () => {
  const [filmId, setFilmId] = React.useState(null);
  const [episodeData, setEpisodeData] = React.useState(null)
  const [seasonData, setSeasonData] = React.useState(null)
  const [isImgBroken, setIsImgBroken] = React.useState(false);
  let params = useParams();
  let episodeId = params?.episodeId;

  const filmsQuery = useGetFilm(params?.id);
  //console.log("filmsQuery", filmsQuery?.data?.film)

  React.useEffect(() => {
    //setFilmId()
    setFilmId(()=> params?.id)
    if (params?.seasonId) {
      const filterSeason = filmsQuery.data?.film?.season?.filter((data) => data.id === params?.seasonId);
      let sdata = filterSeason?.length > 0 ? filterSeason[0] : null

      const filterEpisode = sdata?.episodes?.filter((data) => data.id === params?.episodeId);

      console.log("filterEpisode", filterEpisode)

    //  console.log("filterEpisode", filterEpisode)
      setEpisodeData(() => filterEpisode?.length > 0 ? filterEpisode[0] : null)

      setSeasonData(() => filterSeason?.length > 0 ? filterSeason[0] : null)
     // console.log("seasonData", seasonData)
    } else {
      setSeasonData(() => null)
      setEpisodeData(() => null)
    }
}, [filmsQuery.data?.film?.id,filmsQuery.data?.film?.season, params?.seasonId,]);





const handleImgError = (e) => {
  setIsImgBroken(true)
}
  //console.log("params", params)
  return (
    <div className="max-h-screen h-[100vh] w-full flex flex-col bg-whites-900 relative">
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 relative overflow-auto">
        {/** side bar */}

        <Sidebar />

        {/** content */}
        <div className="bg-[#24222a] min-h-[100vh] flex-1 px-10 overflow-auto">
          {/** title */}
          <CustomStack className="bg-[#24222a] z-50 w-full justify-between items-start py-6 sticky top-0 flex-col">
            <div className="flex flex-row items-center gap-9">
              <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
               {episodeData?.title}
              </Typography>

              <div className=" font-[Inter-Medium] select-none  text-xs flex w-max h-max text-primary-500 px-2 py-1 border border-primary-500 rounded-lg bg-secondary-800 ">Episode</div>
            </div>

            <div className="">
              <ul className="font-[Inter-Regular] text-[#FFFAF6] flex list-disc w-full space-x-8 text-base flex-wrap gap-y-3 items-start justify-start">
                {/* <li className="w-max list-none">Episode </li> */}
                <li className="w-max list-none">{episodeData?.yearOfProduction}</li>
              </ul>
            </div>
          </CustomStack>

          {/** Movie Details & Tabs  */}
          <div className="pt-7 pb-11 ">
            {/** Movie details */}
            <div className="flex flex-row gap-4">
              {/** image */}

              <img onError={handleImgError} src={ isImgBroken ? NoImage : episodeData?.posters[0]?.url} alt="" className="w-[210.15px] object-cover h-[272.5px]" />

              <div className="flex flex-col max-w-[640px] gap-6">
                <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">{episodeData?.overview} </h1>
                <div className="flex flex-wrap gap-3">
                  {episodeData?.genre?.map((data, index) => {
                    return (
                      <div key={index} className="flex py-1 px-5 bg-[#D9D9D9] bg-opacity-15 rounded-full ring-1 ring-[#FFFFFE] text-whites-50">{data}</div>
                    )
                  })}
                </div>

              </div>
            </div>

            <div className="mt-7">
              <FilmDetailTab type="episode" film={episodeData} />
            </div>
          </div>


        </div>
      </div>
 

    </div>
  )
}

export default ViewEpisodeContent