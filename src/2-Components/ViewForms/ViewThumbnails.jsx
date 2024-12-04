import React from 'react'

const ViewThumbnails = ({
    film
}) => {
    const [posterData, setPosterData] = React.useState([]);
    const [backdropData, setBackdropData] = React.useState([]);

    //console.log(film?.posters)

    React.useEffect(() => {
        let posterArray = [];
        let backdropArray = []; 
         film?.posters?.filter((data, index) => {
            if (data.isCover === true) {
                posterArray.push(data);
            }else {
                backdropArray.push(data);
            }
                return ;
            
        })

        

        setPosterData(posterArray);
        setBackdropData(backdropArray);
    }, [film?.posters]);
       
    
  return (
      <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
          {/** Poster Image */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Poster Image</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">You can upload up to 3 different posters</p>
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

          {/** Backdrop Images */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Backdrop Image</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">You can upload up to 3 different backdrop images(screenshots from the film)</p>
              </div>

              <div className="flex flex-wrap gap-3">
                  {/** Image Content */}
                  {
                     backdropData?.map((data, index) => {
                          return (
                              <div key={index} className="flex flex-col gap-[20px]">
                                  <img src={data.url} className="bg-[#36323E] w-[320px] h-[233px] object-cover flex " />


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