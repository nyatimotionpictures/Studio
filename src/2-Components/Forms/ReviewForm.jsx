import React from 'react'
import CustomStack from '../Stacks/CustomStack'
import { FormContainer } from '../Stacks/InputFormStack';
import { Typography } from '@mui/material';
import { ratingArray } from '../../1-Assets/data/Ratings';
import CustomRatingButton from '../RadioButtons/CustomRatingButton';
import { visibilityData } from '../../1-Assets/data/FilmSelectData';

const ReviewForm = () => {
  return (
    <CustomStack className="h-full w-full flex flex-col gap-5">
      {/** content details */}
      <CustomStack className="border-b-2 border-t-secondary-500 pb-4">
        <FormContainer className="gap-2">
          <CustomStack className="flex-col pb-4">
            <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-lg">
              Content Details
            </Typography>
          </CustomStack>
          <CustomStack className="h-full w-full flex flex-col gap-5">
            {/** title && type */}
            <CustomStack className="flex-row justify-between gap-6">
              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Title name (required)
                </label>
                <input />
              </FormContainer>

              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Type (required)
                </label>
                <input />
              </FormContainer>
            </CustomStack>
            {/** audio and subtitles */}
            <CustomStack className="flex-row justify-between gap-6">
              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Audio Languages (required)
                </label>
                <input />
              </FormContainer>
              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Embedded Subtitles
                </label>
                <input />
              </FormContainer>
              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Subtitles Language
                </label>
                <input />
              </FormContainer>
            </CustomStack>
            {/** runtime && year of production */}
            <CustomStack className="flex-row justify-between gap-6">
              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Runtime in Minutes
                </label>
                <input />
              </FormContainer>
              <FormContainer>
                <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                  Runtime in Minutes
                </label>
                <input />
              </FormContainer>
            </CustomStack>
            {/** genre */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Genre
              </label>
              <input />
            </FormContainer>
            {/** tagline */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                tagline
              </label>
              <input />
            </FormContainer>
            {/** plot summary */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                plot summary - 80-160 words (required)
              </label>
              <textarea />
            </FormContainer>
            {/** plot synopsis */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                plot synopsis
              </label>
              <textarea className="textarealg" />
            </FormContainer>
          </CustomStack>
        </FormContainer>
      </CustomStack>
      {/** Audience, Visibility & Payment model */}
      <CustomStack className="border-b-2 border-t-secondary-500 pb-4">
        <FormContainer className="gap-2">
          <CustomStack className="flex-col pb-4">
            <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-lg">
              Audience, Visibility & Payment model
            </Typography>
          </CustomStack>
          <CustomStack className="h-full w-full flex flex-col gap-5">
            {/** visiblity */}
            <FormContainer className="gap-4 border-b-2 border-t-secondary-500 pb-4">
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
                  <label htmlFor="MadeForChildren">
                    Yes, its made for children
                  </label>
                </div>
                <div className="flex relative h-5 items-center gap-3">
                  <input
                    name="audienceType"
                    type="radio"
                    id="NotMadeForChildren"
                  />
                  <label htmlFor="NotMadeForChildren">
                    No, it's not made for children
                  </label>
                </div>
              </CustomStack>

              {/** radio ratings */}

              <CustomStack className="flex-wrap gap-3">
                {ratingArray.map((data, index) => {
                  return (
                    <CustomRatingButton
                      key={data.ratedId}
                      ratedId={data.ratedId}
                      btntitle={data.btntitle}
                      radiogroupName={"filmRating"}
                      btnText={data.btnText}
                      btnImg={data.btnImg}
                    />
                  );
                })}
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
                {visibilityData.map((data, index) => {
                  return (
                    <div
                      key={data.title}
                      className="flex relative h-5 items-center gap-3"
                    >
                      <input name="visibility" type="radio" id={data.title} />
                      <label htmlFor={data.title}>{data.title}</label>
                    </div>
                  );
                })}
              </CustomStack>
            </FormContainer>

            {/** trial timeframe */}
            <FormContainer>
              <CustomStack className="flex-col pb-2">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Free Trial
                </Typography>
              </CustomStack>

              <label className="label font-[Inter-Regular] text-xs text-whites-100 text-opacity-75">
                Trial Timeframe(in days)
              </label>
              <input />
            </FormContainer>

            {/** Download to rent */}
            <FormContainer>
              <CustomStack className="flex-col pb-2">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Set Download-to-rent (DTR) Pricing in UGX
                </Typography>
              </CustomStack>

              <CustomStack className="flex-row justify-between gap-6">
                <FormContainer>
                  <label className="label font-[Inter-Regular] text-xs text-whites-100 text-opacity-75">
                    Price (required)
                  </label>
                  <input />
                </FormContainer>
                <FormContainer>
                  <label className="label font-[Inter-Regular] text-xs text-whites-100 text-opacity-75">
                    Rental Timeframe(in days)
                  </label>
                  <input />
                </FormContainer>
              </CustomStack>
            </FormContainer>

            {/** Download to own */}
            <FormContainer>
              <CustomStack className="flex-col pb-2">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Set Download-to-own (DTO) Pricing in UGX
                </Typography>
              </CustomStack>

              <label className="label font-[Inter-Regular] text-xs text-whites-100 text-opacity-75">
                Price (required)
              </label>
              <input />
            </FormContainer>
          </CustomStack>
        </FormContainer>
      </CustomStack>
      {/** images and trailer */}
      <CustomStack className="pb-4">
        <FormContainer className="gap-2">
          <CustomStack className="flex-col pb-4">
            <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-lg">
              Film Poster image
            </Typography>
            <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
              poster images to be uploaded
            </Typography>
          </CustomStack>

          <CustomStack className="w-full flex-wrap justify-between gap-0">
            {[...Array(3)].map((data, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col h-[561px] w-[30%] justify-between"
                >
                  {/** image */}
                  <div className="w-full h-[87%] bg-primary-50"></div>
                  {/** size */}
                  <div className="flex flex-col gap-2">
                    <Typography className="font-[Inter-Regular] text-[#76757A] text-sm">
                      Size
                    </Typography>
                    <Typography className="font-[Inter-Medium] text-whites-50 text-base">
                      900x1350
                    </Typography>
                  </div>
                </div>
              );
            })}
          </CustomStack>
        </FormContainer>
      </CustomStack>

      {/** trailer */}
      <CustomStack className="pb-4">
        <FormContainer className="gap-2">
          <CustomStack className="flex-col pb-4">
            <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-lg">
              Trailer (Uploaded short-video file)
            </Typography>
          </CustomStack>

          <CustomStack className="w-full flex-wrap justify-between gap-0">
            <div className="flex flex-col h-[500px] w-[60%] justify-between">
              {/** image */}
              <div className="w-full h-[87%] bg-primary-50"></div>
              {/** size */}
              <div className="flex flex-row gap-10">
                <div className="flex flex-col gap-2">
                  <Typography className="font-[Inter-Regular] text-[#76757A] text-base">
                    Trailer name
                  </Typography>
                  <Typography className="font-[Inter-Medium] text-whites-50 text-base">
                    Official Trailer
                  </Typography>
                </div>
                <div className="flex flex-col gap-2">
                  <Typography className="font-[Inter-Regular] text-[#76757A] text-base">
                    Duration
                  </Typography>
                  <Typography className="font-[Inter-Medium] text-whites-50 text-base">
                    01m 25s
                  </Typography>
                </div>
                <div className="flex flex-col gap-2">
                  <Typography className="font-[Inter-Regular] text-[#76757A] text-base">
                    Size
                  </Typography>
                  <Typography className="font-[Inter-Medium] text-whites-50 text-base">
                    120.B
                  </Typography>
                </div>
              </div>
            </div>
          </CustomStack>
        </FormContainer>
      </CustomStack>
    </CustomStack>
  );
}

export default ReviewForm