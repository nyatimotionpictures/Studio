import React from 'react'
import CustomStack from '../Stacks/CustomStack';
import { FormContainer } from '../Stacks/InputFormStack';
import { Typography } from '@mui/material';
import { ratingArray } from '../../1-Assets/data/Ratings';
import CustomRatingButton from '../RadioButtons/CustomRatingButton';
import { visibilityData } from '../../1-Assets/data/FilmSelectData';

const ViewAudienceDetails = ({film}) => {
    const [ratingData, setRatingData] = React.useState(null)
   

    React.useEffect(() => { 
        if (film?.audienceAgeGroup) {
            const filterData = ratingArray.filter((data) => data.ratedId === film?.audienceAgeGroup)

            setRatingData(() => filterData)
        } else {
            setRatingData(() => null)
        }

    }, [film?.audienceAgeGroup])

    

   // console.log(ratingArray)
   // console.log(film)
   
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
                    {
                        film?.audienceTarget  && film?.audienceTarget  === "MadeForChildren" ? (
                            <CustomStack className="flex-row gap-7">
                            <div className="flex relative h-5 items-center gap-3">
                                <input
                                 readOnly
                                 checked={true}
                                 value={film?.audienceTarget }
                                    name="audienceType"
                                    type="radio"
                                    id="MadeForChildren"
                                />
                                <label htmlFor="MadeForChildren" className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                    Yes, its made for children
                                </label>
                            </div>
                            
                        </CustomStack>

                        ) : null

                    }

{
                        film?.audienceTarget  && film?.audienceTarget  === "NotMadeForChildren" ? (
                            <CustomStack className="flex-row gap-7">
                            <div className="flex relative h-5 items-center gap-3">
                                <input
                                readOnly
                                checked={true}
                                value="NotMadeForChildren"
                                    name="audienceTarget "
                                    type="radio"
                                    id="NotMadeForChildren"
                                />
                                <label htmlFor="NotMadeForChildren" className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                    Yes, its made for children
                                </label>
                            </div>
                            
                        </CustomStack>

                        ) : null

                    }
                         
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
                             
                          </CustomStack>
                          {/** radio buttons */}
                          <CustomStack className="flex-col gap-2">
                          
                          {
                            film?.visibility && (
                                <div
                                          
                                className="flex relative h-5 items-center gap-3"
                            >
                                <input name="visibility" type="radio" id={film?.visibility} checked={true} readOnly />
                                <label htmlFor={film?.visibility} className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">{film?.visibility}</label>
                            </div>
                            )
                          }
                                     
                                
                             
                          </CustomStack>
                      </FormContainer>

                       {/** Access */}
                       <FormContainer className="gap-2 pb-4">
                          <CustomStack className="flex-col ">
                              <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                                  Access
                              </Typography>
                             
                          </CustomStack>
                          {/** radio buttons */}
                          <CustomStack className="flex-col gap-2">
                          
                          {
                            film?.access && (
                                <div
                                          
                                className="flex relative h-5 items-center gap-3"
                            >
                                <input name="access" readOnly type="radio" id={film?.access} checked={true} />
                                <label htmlFor={film?.access} className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">{film?.access}</label>
                            </div>
                            )
                          }
                                     
                                
                             
                          </CustomStack>
                      </FormContainer>

                       {/** donations */}
                       <FormContainer className="gap-2  border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Donations
                </Typography>
                
              </CustomStack>
              {/** radio buttons */}
              <CustomStack className="flex-col gap-2 text-[#f2f2f2]">
               
                    <div
                      
                      className="flex relative h-5 items-center gap-3"
                    >
                    <input checked={film?.enableDonation === true ? true : false} readOnly   name="enableDonation" type="checkbox" id={"enableDonation"} />
                      <label htmlFor={"enableDonation"}>Enabled Donations</label>
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