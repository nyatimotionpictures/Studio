import React from 'react'

const ViewThumbnails = ({
    film,
    type
}) => {
    const [posterData, setPosterData] = React.useState([]);
    const [backdropData, setBackdropData] = React.useState([]);
    const [episodeThumbData, setEpisodeThumbData] = React.useState([]);

    //console.log(film?.posters)

    React.useEffect(() => {
        let posterArray = [];
        let backdropArray = [];
        let episodeThumbArray = [];
         film?.posters?.filter((data, index) => {
            if (data.isCover === true) {
                posterArray.push(data);
            } else if (type === "episode" && data.isEpisodeThumbnail === true) {
                episodeThumbArray.push(data);
            } else {
                backdropArray.push(data);
            }
                return ;
            
        })

        

        setPosterData(posterArray);
        setBackdropData(backdropArray);
        setEpisodeThumbData(episodeThumbArray);
    }, [film?.posters]);
       
    
  return (
      <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
          {/** Poster Image */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Poster Image</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">You can upload up to 3 different posters</p>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Recommended resolution is 1800 × 2700 px (Vertical 2:3)</p>
              </div>

              <div className="flex flex-wrap gap-3">
                  {/** Image Content */}
                  {
                      posterData?.map((data, index) => {
                          return (
                              <div key={index} className="flex flex-col gap-[20px]">
                                  <img src={data.url} className="bg-[#36323E] w-[300px] h-[307.69px] object-cover flex "/>

                                  {/* <div className="flex flex-col gap-1">
                                      <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Size</h1>
                                      <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">900x1350</p>
                                  </div> */}
                              </div>
                          )
                      })
                  }
                 
              </div>
          </div>

          {type === "episode" && (
            <div className='flex flex-col  gap-6'>
                <div className="flex flex-col gap-[7px] min-w-[150px]">
                    <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Episode Thumbnails</h1>
                    <p className="font-[Inter-Regular] text-base text-[#706E72]">You can upload up to 3 different thumbnails</p>
                    <p className="font-[Inter-Regular] text-base text-[#706E72]">Recommended resolution is 1920 × 1080 px (Horizontal 16:9)</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {episodeThumbData?.map((data, index) => {
                          return (
                              <div key={index} className="flex flex-col gap-[20px]">
                                  <img src={data.url} className="bg-[#36323E] w-[400px] h-[225px] object-cover flex " />
                              </div> 
                          )
                      })
                    }
                </div>
            </div>
          )}

          {/** Backdrop Images */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Backdrop Image</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">You can upload up to 3 different backdrop images(screenshots from the film)</p>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Recommended resolution is 2560 × 1440 px (Horizontal 16:9)</p>
              </div>

              <div className="flex flex-wrap gap-3">
                  {/** Image Content */}
                  {
                     backdropData?.map((data, index) => {
                          return (
                              <div key={index} className="flex flex-col gap-[20px]">
                                  <img src={data.url} className="bg-[#36323E] w-[400px] h-[225px] object-cover flex " />


                              </div> 
                          )
                      })
                  }
                 
              </div>
          </div>
          
      </div>
  )
}

export default ViewThumbnails