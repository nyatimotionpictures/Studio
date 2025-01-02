import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Typography } from "@mui/material";
import { ratingArray } from "../../1-Assets/data/Ratings";
import { visibilityData, accessData } from "../../1-Assets/data/FilmSelectData";

import CustomRatingButton from "../RadioButtons/CustomRatingButton";
import ErrorMessage from "./ErrorMessage";

const Audience = ({ innerref, handleStepNext, editdata, film }) => {
/**
 *    audienceTarget: null,
    audienceAgeGroup: null,
    visibility: null,
       access: 'free',
 * 
 */
 // console.log(film)
  const validationSchema = yup.object().shape({
    audienceTarget: yup.string().required("required"),
    audienceAgeGroup: yup.string().required("required"),
    visibility: yup.string().required("required"),
    enableDonation: yup.string().required("required"),
   // access: yup.string().required("required"),
  });

  const initialValues = editdata ? {
    ...film,
    id: film?.id,
    audienceTarget: film?.audienceTarget ?? "",
    audienceAgeGroup: film?.audienceAgeGroup ?? "",
    visibility: film?.visibility ?? "",
    access: film?.access ?? "",
    enableDonation: film?.enableDonation ?? false,
  } : {
    audienceTarget: "",
    audienceAgeGroup: "",
    visibility: "",
    access: "",
    enableDonation: false,
    featured: false,
  };


  return (
    <Formik
      innerRef={innerref}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
       // console.log(values);
        handleStepNext(values);
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
              <CustomStack className="flex-col gap-2 text-[#f2f2f2]">
                <div className="flex relative h-5 items-center gap-3 ">
                  <input
                  checked={values.audienceTarget === "MadeForChildren"}
                  value={"MadeForChildren"}
                  onChange={handleChange}
                    name="audienceTarget"
                    type="radio"
                    id="MadeForChildren"
                  />
                  <label htmlFor="MadeForChildren">
                    Yes, its made for children
                  </label>
                </div>
                <div className="flex relative h-5 items-center gap-3">
                  <input
                  checked={values.audienceTarget === "NotMadeForChildren"}
                     value={"NotMadeForChildren"}
                     onChange={handleChange}
                    name="audienceTarget"
                    type="radio"
                    id="NotMadeForChildren"
                  />
                  <label htmlFor="NotMadeForChildren">
                    No, it's not made for children
                  </label>
                </div>
                <ErrorMessage
                errors={touched?.audienceTarget && errors?.audienceTarget ? true : false}
                name="audienceTarget"
                message={errors?.audienceTarget && errors.audienceTarget}
              />
              </CustomStack>

              {/** radio ratings */}

              <CustomStack className="flex-wrap gap-3">
                {ratingArray.map((data, index) => {
                  return (
                    <CustomRatingButton
                      key={data.ratedId}
                      checked={values.audienceAgeGroup === data.ratedId}
                      ratedId={data.ratedId}
                      btntitle={data.btntitle}
                      radiogroupName={"audienceAgeGroup"}
                      btnText={data.btnText}
                      btnImg={data.btnImg}
                      handleChange={setFieldValue}
                      value={values.audienceAgeGroup}
                    />
                  );
                })}
              </CustomStack>
              <ErrorMessage
                errors={ errors?.audienceAgeGroup ? true : false}
                name="audienceTarget"
                message={errors?.audienceAgeGroup && errors.audienceAgeGroup}
              />
            </FormContainer>
            {/** visibility */}
            <FormContainer className="gap-2  border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Visibility
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  Choose when to publish and who can see your video
                </Typography>
              </CustomStack>
              {/** radio buttons */}
              <CustomStack className="flex-col gap-2 text-[#f2f2f2]">
                {visibilityData.map((data, index) => {
                  return (
                    <div
                      key={data.title}
                      className="flex relative h-5 items-center gap-3"
                    >
                      <input checked={values.visibility === data.title} onChange={()=> setFieldValue("visibility", data.title)} name="visibility" type="radio" id={data.title} />
                      <label htmlFor={data.title}>{data.title}</label>
                    </div>
                  );
                })}
              </CustomStack>

              <ErrorMessage
                errors={ errors?.visibility ? true : false}
                name="visibility"
                message={errors?.visibility && errors.visibility}
              />
            </FormContainer>

              {/** Access */}
              <FormContainer className="gap-2  border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Access
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                  Choose how the video should be accessed 
                </Typography>
              </CustomStack>
              {/** radio buttons */}
              <CustomStack className="flex-col gap-2 text-[#f2f2f2]">
                {accessData.map((data, index) => {
                  return (
                    <div
                      key={data.title}
                      className="flex relative h-5 items-center gap-3"
                    >
                      <input checked={values.access === data.title} onChange={()=> setFieldValue("access", data.title)} name="access" type="radio" id={data.title} />
                      <label htmlFor={data.title}>{data.title}</label>
                    </div>
                  );
                })}
              </CustomStack>

              <ErrorMessage
                errors={ errors?.access ? true : false}
                name="access"
                message={errors?.access && errors.access}
              />
            </FormContainer>

             {/** Donations */}
             <FormContainer className="gap-2  border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Donations
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                Do you want to allow people to donate to this film?
                </Typography>
              </CustomStack>
              {/** radio buttons */}
              <CustomStack className="flex-col gap-2 text-[#f2f2f2]">
               
                    <div
                      
                      className="flex relative h-5 items-center gap-3"
                    >
                    <input checked={values.enableDonation === true} onChange={(e)=> {
                     
                      setFieldValue("enableDonation", e.target.checked)}} name="enableDonation" type="checkbox" id={"enableDonation"} />
                      <label htmlFor={"enableDonation"}>Enable Donations</label>
                    </div>
                 
              </CustomStack>

              <ErrorMessage
                errors={ errors?.enableDonation ? true : false}
                name="enableDonation"
                message={errors?.enableDonation && errors.enableDonation}
              />
            </FormContainer>


    {/** Featured */}
    <FormContainer className="gap-2  border-t-secondary-500 pb-4">
              <CustomStack className="flex-col ">
                <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                  Featured
                </Typography>
                <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                Do you want to appear on the featured film slider?
                </Typography>
              </CustomStack>
              {/** radio buttons */}
              <CustomStack className="flex-col gap-2 text-[#f2f2f2]">
               
                    <div
                      
                      className="flex relative h-5 items-center gap-3"
                    >
                    <input checked={values.featured === true} onChange={(e)=> {
                     
                      setFieldValue("featured", e.target.checked)}} name="featured" type="checkbox" id={"featured"} />
                      <label htmlFor={"featured"}>Featured </label>
                    </div>
                 
              </CustomStack>

              <ErrorMessage
                errors={ errors?.featured ? true : false}
                name="enableDonation"
                message={errors?.featured && errors.featured}
              />
            </FormContainer>
            
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default Audience;
