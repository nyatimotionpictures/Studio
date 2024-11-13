import React from 'react'
import Button from '../Buttons/Button'

const ViewTrailerFilm = () => {
  return (
      <div className="flex flex-col h-full w-full gap-14 max-w-[1000px]">
          {/** Trailer */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-row  gap-8 items-center">
                  <div className="flex flex-col gap-[7px] min-w-[150px] max-w-[80%]">
                      <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Trailer</h1>
                      <p className="font-[Inter-Regular] text-base text-[#706E72]">You can upload a file that contains full-motion (digital video) that is at least 1-3 minute video</p>
                  </div>

                  <div className="">
                      <Button className="w-max min-w-[150px]">Upload File</Button>
                  </div>
                 
              </div>
            

              <div className="flex flex-wrap gap-3">
                  {/** Image Content */}
                  
                              <div  className="flex flex-col gap-[20px]">
                                  <div className="bg-[#36323E] w-[470px] h-[266px] flex "></div>

                      <div className='flex flex-row gap-10'>
                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Duration</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">01ms 23s</p>
                          </div>

                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Size</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">120 MB</p>
                          </div>
                      </div>
                                  
                              </div>
                        
                  

              </div>
          </div>

          {/** SD */}
          <div className='flex flex-col  gap-6'>
              <div className='flex items-center gap-8'>
                      <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">SD (480P)</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Please upload a file that contains a digital video in SD (480p) format for optimal playback and compatibility.</p>
                  </div>
                  
                  <div className="">
                      <Button className="w-max min-w-[150px]">Upload File</Button>
                  </div>
              </div>
      

              <div className="flex flex-col gap-5">
                  {/** price */}
                  <div className="flex flex-col gap-[10px]">
                      <p className="font-[Inter-Regular] text-base text-[#706E72]">Price (required).</p>
                      <div className="bg-[#36323E] w-[500px] min-h-[43.09px] flex font-[Inter-SemiBold] text-base sm:text-lg text-whites-40 p-4 rounded-md">UGX 7,000</div>
                  </div>
                  {/** FILM */}
                  <div className="flex flex-col gap-[20px]">
                      <div className="bg-[#36323E] w-[500px] h-[266px] flex items-center justify-center text-whites-40 font-[Inter-SemiBold] text-base sm:text-lg"> No Video Uploaded</div>

                      <div className='flex flex-row gap-10'>
                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Duration</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">01ms 23s</p>
                          </div>

                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Size</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">120 MB</p>
                          </div>
                      </div>

                  </div>



              </div>
          </div>
          {/** hd */}
          <div className='flex flex-col  gap-6'>
              <div className="flex gap-8">
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">HD (720P)</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Please upload a file that contains a digital video in HD (720p) format for optimal playback and compatibility.</p>
              </div> 
              
                  <div className="">
                      <Button className="w-max min-w-[150px]">Upload File</Button>
                  </div>
              </div>
             

              <div className="flex flex-col gap-5">
                  {/** price */}
                  <div className="flex flex-col gap-[10px]">
                      <p className="font-[Inter-Regular] text-base text-[#706E72]">Price (required).</p>
                      <div className="bg-[#36323E] w-[500px] min-h-[43.09px] flex font-[Inter-SemiBold] text-base sm:text-lg text-whites-40 p-4 rounded-md">UGX 7,000</div>
                  </div>
                  {/** FILM */}
                  <div className="flex flex-col gap-[20px]">
                      <div className="bg-[#36323E] w-[500px] h-[266px] flex items-center justify-center text-whites-40 font-[Inter-SemiBold] text-base sm:text-lg"> No Video Uploaded</div>

                      <div className='flex flex-row gap-10'>
                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Duration</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">01ms 23s</p>
                          </div>

                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Size</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">120 MB</p>
                          </div>
                      </div>

                  </div>



              </div>
          </div>
          {/** fullhd */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Full HD (1080P)</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Please upload a file that contains a digital video in Full HD (1080p) format for optimal playback and compatibility.</p>
              </div>

              <div className="flex flex-col gap-5">
                  {/** price */}
                  <div className="flex flex-col gap-[10px]">
                      <p className="font-[Inter-Regular] text-base text-[#706E72]">Price (required).</p>
                      <div className="bg-[#36323E] w-[500px] min-h-[43.09px] flex font-[Inter-SemiBold] text-base sm:text-lg text-whites-40 p-4 rounded-md">UGX 7,000</div>
                  </div>
                  {/** FILM */}
                  <div className="flex flex-col gap-[20px]">
                      <div className="bg-[#36323E] w-[500px] h-[266px] flex items-center justify-center text-whites-40 font-[Inter-SemiBold] text-base sm:text-lg"> No Video Uploaded</div>

                      <div className='flex flex-row gap-10'>
                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Duration</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">01ms 23s</p>
                          </div>

                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Size</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">120 MB</p>
                          </div>
                      </div>

                  </div>



              </div>
          </div>
          {/** ultrahd */}
          <div className='flex flex-col  gap-6'>
              <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">Ultra HD (2160p)</h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">Please upload a file that contains a digital video in Ultra HD (2160p) format for optimal playback and compatibility.</p>
              </div>

              <div className="flex flex-col gap-5">
                  {/** price */}
                  <div className="flex flex-col gap-[10px]">
                      <p className="font-[Inter-Regular] text-base text-[#706E72]">Price (required).</p>
                      <div className="bg-[#36323E] w-[500px] min-h-[43.09px] flex font-[Inter-SemiBold] text-base sm:text-lg text-whites-40 p-4 rounded-md">UGX 7,000</div>
                  </div>
                  {/** FILM */}
                  <div className="flex flex-col gap-[20px]">
                      <div className="bg-[#36323E] w-[500px] h-[266px] flex items-center justify-center text-whites-40 font-[Inter-SemiBold] text-base sm:text-lg"> No Video Uploaded</div>

                      <div className='flex flex-row gap-10'>
                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Duration</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">01ms 23s</p>
                          </div>

                          <div className="flex flex-col gap-1">
                              <h1 className="font-[Inter-Regular] text-base text-[#706E72]">Size</h1>
                              <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">120 MB</p>
                          </div>
                      </div>

                  </div>



              </div>
          </div>

      </div>
  )
}

export default ViewTrailerFilm