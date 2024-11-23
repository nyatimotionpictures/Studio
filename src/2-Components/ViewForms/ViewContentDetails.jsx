import React from 'react'

const ViewContentDetails = () => {
    let genreData = [
        "movie", "drama"
    ]
  return (
      <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
          {/** type & year of production */}
          <div className='flex items-center gap-10'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Type</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Film</p>
              </div>

              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Year Of Production</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">2024</p>
              </div>
          </div>
          {/** Genre */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Genre</h1>
              <ul className='flex flex-wrap'>
                  {genreData.map((data, index) => (
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
                      {genreData.map((data, index) => (
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
                      {genreData.map((data, index) => (
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
                  150
              </p>
          </div>

          {/** Plot Summary */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Plot Summary</h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                  A group of young men (Itwara Anthony, Kafuruka Peter, Collin Asiimwe and Godfrey K.) in rural Ugandan town decide to be more involved in the political.
              </p>
          </div>

          {/** Plot Summary */}
          <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Plot Synopsis</h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                  A group of young men (Itwara Anthony, Kafuruka Peter, Collin Asiimwe and Godfrey K.) in rural Ugandan town decide to be more involved in the political process after their football pitch has been allocated to a private investor with the help of their local councillor. They take advantage of the upcoming by-election to find a candidate to save their football pitch. The club captain, Kato (Peter Kafuruka) contests as a compromise candidate of the Citizens Empowerment Party (CEP). However, Kato’s conservative parents belong to different parties and are not amused; they do not even support him. Can Kato, a barber and teacher, manage the tough game of politics? 
              </p>
          </div>
      </div>
  )
}

export default ViewContentDetails