import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Typography } from "@mui/material";
import { ratingArray } from "../../1-Assets/data/Ratings";
import { visibilityData } from "../../1-Assets/data/FilmSelectData";

import CustomRatingButton from "../RadioButtons/CustomRatingButton";

const Audience = ({ innerref, handleStepNext }) => {
  const validationSchema = yup.object().shape({
    title: yup.string().required("required"),
  });

  const initialValues = {
    title: "",
  };
  return (
    <Formik
      innerRef={innerref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        handleStepNext();
      }}
    >
      {({ values, handleChange, errors, touched, setFieldValue }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5">
            {/** title */}
            <FormContainer className="gap-2 border-b-2 border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Audience
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  Is this video made for kids? (required)
                </Typography>
              </CustomStack>

              {/** radio buttons */}
              <CustomStack className="flex-col gap-2">
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
            <FormContainer className="gap-2 border-b-2 border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Visibility
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  Choose when to publish and who can see your video
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
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  Free trial represents download to lease, wherein a piece of
                  content is accessible to look for a specific timeframe for
                  free
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
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  DTR represents download to lease, wherein a piece of content
                  is accessible to look for a specific timeframe at the cost of
                  a one-time expense.
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
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  DTO represents download to own, whereby consumers pay a
                  one-time fee to download the media for unlimited viewing.
                </Typography>
              </CustomStack>

              <label className="label font-[Inter-Regular] text-xs text-whites-100 text-opacity-75">
                Price (required)
              </label>
              <input />
            </FormContainer>
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default Audience;
