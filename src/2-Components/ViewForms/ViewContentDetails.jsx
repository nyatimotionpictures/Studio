import React from 'react'

const ViewContentDetails = ({film}) => {
  
  return (
      <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
          {/** type & year of production */}
          <div className='flex items-center gap-10'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Type</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">{film?.type}</p>
              </div>

              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Year Of Production</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">{film?.yearOfProduction}</p>
              </div>
          </div>
          {/** Genre */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Genre</h1>
              <ul className='flex flex-wrap'>
                  {film?.genre.map((data, index) => (
                      <span
                          key={index}
                          className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                      >
                          {(index ? ", " : "") + data}
                      </span>
                  ))}
              </ul>
          </div>

          {/** Audio Languages & Subtitles */}
          <div className='flex items-center gap-10'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Audio Languages</h1>
                  <ul className='flex flex-wrap'>
                      {film?.audioLanguages?.map((data, index) => (
                          <span
                              key={index}
                              className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                          >
                              {(index ? ", " : "") + data}
                          </span>
                      ))}
                  </ul>
              </div>

              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Subtitles</h1>
                  <ul className='flex flex-wrap'>
                      {film?.subtitleLanguage?.map((data, index) => (
                          <span
                              key={index}
                              className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                          >
                              {(index ? ", " : "") + data}
                          </span>
                      ))}
                  </ul>
              </div>
          </div>

          {/** Runtime in Minutes */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Runtime in Minutes</h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                  {film?.runtime}
              </p>
          </div>

          {/** Plot Summary */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Plot Summary</h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                  {film?.plotSummary}
              </p>
          </div>

          {/** Plot Synopsis */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Plot Synopsis</h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                 {film?.overview}
              </p>
          </div>
      </div>
  )
}

export default ViewContentDetails