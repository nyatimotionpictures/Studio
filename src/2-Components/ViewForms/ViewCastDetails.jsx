import React from 'react'

const ViewCastDetails = () => {
    let sampleData = [
        "movie", "drama"
    ]
  return (
      <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
          {/** Cast */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Cast</h1>
              <ul className='flex flex-wrap'>
                  {sampleData.map((data, index) => (
                      <span
                          key={index}
                          className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                      >
                          {(index ? ", " : "") + data}
                      </span>
                  ))}
              </ul>
          </div>


          {/** Directors */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Directors</h1>
              <ul className='flex flex-wrap'>
                  {sampleData.map((data, index) => (
                      <span
                          key={index}
                          className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                      >
                          {(index ? ", " : "") + data}
                      </span>
                  ))}
              </ul>
          </div>

          {/** Producers */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Producers</h1>
              <ul className='flex flex-wrap'>
                  {sampleData.map((data, index) => (
                      <span
                          key={index}
                          className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                      >
                          {(index ? ", " : "") + data}
                      </span>
                  ))}
              </ul>
          </div>

          {/** Writers */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Writers</h1>
              <ul className='flex flex-wrap'>
                  {sampleData.map((data, index) => (
                      <span
                          key={index}
                          className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                      >
                          {(index ? ", " : "") + data}
                      </span>
                  ))}
              </ul>
          </div>

          {/** Sound Core */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Sound Core</h1>
              <ul className='flex flex-wrap'>
                  {sampleData.map((data, index) => (
                      <span
                          key={index}
                          className="font-[Inter-Regular] text-[14px] sm:text-base text-[#706E72]"
                      >
                          {(index ? ", " : "") + data}
                      </span>
                  ))}
              </ul>
          </div>
         

          {/** Runtime in Minutes */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Year Of Production</h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                  150
              </p>
          </div>

      </div>
  )
}

export default ViewCastDetails