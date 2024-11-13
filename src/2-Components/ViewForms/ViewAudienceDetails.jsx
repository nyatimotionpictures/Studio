import React from 'react'
import CustomStack from '../Stacks/CustomStack';
import { FormContainer } from '../Stacks/InputFormStack';
import { Typography } from '@mui/material';
import { ratingArray } from '../../1-Assets/data/Ratings';
import CustomRatingButton from '../RadioButtons/CustomRatingButton';
import { visibilityData } from '../../1-Assets/data/FilmSelectData';

const ViewAudienceDetails = () => {
    const [ratingData, setRatingData] = React.useState(null)
    let genreData = [
        "movie", "drama"
    ]

    const ratingId = "rated_G"

    React.useEffect(() => { 
        if (ratingId) {
            const filterData = ratingArray.filter((data) => data.ratedId === ratingId)

            setRatingData(() => filterData)
        } else {
            setRatingData(() => null)
        }

    }, [ratingId])
   
  return (
      <div className="flex flex-col h-full w-full gap-5 max-w-[1000px]">
          {/** type & year of production */}
          {/** Audience, Visibility & Payment model */}
          <CustomStack className=" pb-4">
              <FormContainer className="gap-2">
                  <CustomStack className="h-full w-full flex flex-col gap-5">
                      {/** visiblity */}
                      <FormContainer className="gap-4  pb-4">
                          <CustomStack className="flex-col ">
                              <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                                  Audience
                              </Typography>
                          </CustomStack>

                          {/** radio buttons */}
                          <CustomStack className="flex-row gap-7">
                              <div className="flex relative h-5 items-center gap-3">
                                  <input
                                      name="audienceType"
                                      type="radio"
                                      id="MadeForChildren"
                                  />
                                  <label htmlFor="MadeForChildren" className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                      Yes, its made for children
                                  </label>
                              </div>
                              
                          </CustomStack>

                          {/** radio ratings */}

                          <CustomStack className="flex-wrap gap-3">
                              {ratingData !== null && ratingData.length > 0 ? ratingData.map((data, index) => {
                                  
                                      return (
                                          <label
                                              key={data.ratedId}
                                              htmlFor={data.ratedId}
                                              className="flex flex-col  relative h-44 bg-[#E5E7EB]  text-secondary-900 rounded-lg min-w-80 w-max p-4 gap-3"
                                          >
                                              <div className="flex items-center h-5 w-full justify-between">
                                                  <Typography className="font-[Inter-Medium] text-sm uppercase">
                                                      {data.btntitle}
                                                  </Typography>
                                                
                                              </div>

                                              <div className="h-[45px] w-[133px] relative overflow-hidden">
                                                  <img className="h-full w-full object-contain" src={data.btnImg} alt="" />
                                              </div>

                                              <Typography className="font-[Inter-Bold] text-xs w-[289px]">
                                                  {data.btnText}
                                              </Typography>
                                          </label>
                                      );  
                                 
                                
                              }): null}
                          </CustomStack>
                      </FormContainer>
                      {/** visibility */}
                      <FormContainer className="gap-2 pb-4">
                          <CustomStack className="flex-col ">
                              <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                                  Visibility
                              </Typography>
                              <Typography className="font-[Inter-Regular] text-base text-[#706E72]">
                                  Choose when to publish and who can see your video
                              </Typography>
                          </CustomStack>
                          {/** radio buttons */}
                          <CustomStack className="flex-col gap-2">
                          
                                      <div
                                          
                                          className="flex relative h-5 items-center gap-3"
                                      >
                                          <input name="visibility" type="radio" id={"free"} />
                                          <label htmlFor={"free"}>free</label>
                                      </div>
                                
                             
                          </CustomStack>
                      </FormContainer>

                   
                   

                    
                  </CustomStack>
              </FormContainer>
          </CustomStack>
     

        

         


          
      </div>
  )
}

export default ViewAudienceDetails