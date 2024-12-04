
import React from "react";
import Sidebar from "../../../../2-Components/Navigation/Sidebar.tsx";
import CustomStack from "../../../../2-Components/Stacks/CustomStack.jsx";
import {  Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import posterImage from "../../../../1-Assets/Posterimage.png"
import FilmDetailTab from "../../../../2-Components/Tabs/FilmDetailTab.jsx";
import { useGetFilm } from "../../../../5-Store/TanstackStore/services/queries.ts";
import NoImage from "../../../../1-Assets/no-image.svg"
import CustomLoader from "../../../../2-Components/Loader/CustomLoader.jsx";

const ViewFilmContent = () => {
    let navigate = useNavigate(); 
  
    let params = useParams();
    const [isImgBroken, setIsImgBroken] = React.useState(false);
    const [filmId, setFilmId] = React.useState(null);
    const filmsQuery = useGetFilm(params?.id);
    React.useEffect(() => {
        //setFilmId()
        //console.log("filmId", filmsQuery.data)
        setFilmId(()=> params?.id)
    }, [params?.id]);

   // console.log("filmsQuery", filmsQuery.data)
    
    const handleImgError = (e) => {
        setIsImgBroken(true)
    }
    if(filmsQuery.isLoading) {
        return <div className="flex flex-col justify-center items-center h-screen bg-[#24222a]">
            <div className="flex flex-col relative gap-8">
                <div className="w-full h-full relative flex items-center justify-center bg-secondary-800  top-0 left-0 bg-opacity-70 text-red-500">
                 <CustomLoader />

                </div>
           
            <p className="text-center text-xs text-primary-500 font-[Inter-Regular]">Loading...</p>

            </div>
        
        </div>
    }
    if(filmsQuery.isError) {
        return <div className="flex flex-col justify-center items-center h-screen bg-[#24222a]">
        <div className="flex relative gap-8">
        
        <p className="text-center text-xs text-primary-500 font-[Inter-Regular]">Error</p>

        </div>
    
    </div>
    }
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
                               {filmsQuery.data?.film?.title}
                            </Typography>

                            <div className=" font-[Inter-Medium] select-none  text-xs flex w-max h-max text-primary-500 px-2 py-1 border border-primary-500 rounded-lg bg-secondary-800 "> {filmsQuery.data?.film?.type}</div>
                        </div>

                        <div className="">
                            <ul className="font-[Inter-Regular] text-[#FFFAF6] flex list-disc w-full space-x-8 text-base flex-wrap gap-y-3 items-start justify-start">
                                <li className="w-max list-none">{filmsQuery.data?.film?.type} </li>
                                <li className="w-max">{filmsQuery.data?.film?.yearOfProduction}</li>
                            </ul>
                        </div>
                    </CustomStack>

                    {/** Movie Details & Tabs  */}
                    <div className="pt-7 pb-11 ">
                        {/** Movie details */}
                        <div className="flex flex-row gap-4">
                            {/** image */}

                            <img onError={handleImgError} src={ isImgBroken ? NoImage : filmsQuery.data?.film?.posters[0]?.url} alt="" className="w-[210.15px] object-cover h-[272.5px]" />

                            <div className="flex flex-col max-w-[640px] gap-6">
                                <h1 className="font-[Inter-Regular] text-sm text-[#FFFAF6] text-opacity-70">{filmsQuery.data?.film?.overview}</h1>
                                <div className="flex flex-wrap gap-3">
                                    {filmsQuery.data?.film?.genre.map((data, index) => {
                                        return (
                                            <div key={index} className="flex py-1 px-5 bg-[#D9D9D9] bg-opacity-15 rounded-full ring-1 ring-[#FFFFFE] text-whites-50">{data}</div>
                                        )
                                    })}
                                </div>

                            </div>
                        </div>

                        <div className="mt-7">
                            <FilmDetailTab film={filmsQuery.data.film} />
                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    )
}

export default ViewFilmContent