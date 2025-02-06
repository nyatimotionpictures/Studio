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

const Audience = ({ innerref, handleStepNext, editdata, film, type }) => {
  /**
 *    audienceTarget: null,
    audienceAgeGroup: null,
    visibility: null,
       access: 'free',
 * 
 */
  // console.log(film)
  const validationSchema =
    type === "season"
      ? yup.object().shape({
          visibility: yup.string().required("required"),
          // enableDonation: yup.string().required("required"),
          // access: yup.string().required("required"),
        })
      : yup.object().shape({
          audienceTarget: yup.string().required("required"),
          audienceAgeGroup: yup.string().required("required"),
          visibility: yup.string().required("required"),
          // enableDonation: yup.string().required("required"),
          // access: yup.string().required("required"),
        });

  const initialValues = editdata
    ? {
        ...film,
        id: film?.id,
        audienceTarget: film?.audienceTarget ?? "",
        audienceAgeGroup: film?.audienceAgeGroup ?? "",
        visibility: film?.visibility ?? "",
        access: film?.type === "series" ? "free" : film?.access ?? "",
        enableDonation: film?.enableDonation ?? false,
        featured: film?.featured ?? false,
      }
    : {
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
        console.log(values);
        handleStepNext(values);
      }}
    >
      {({ values, handleChange, errors, touched, setFieldValue }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5">
            {type !== "season" && (
              <>
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
                      errors={
                        touched?.audienceTarget && errors?.audienceTarget
                          ? true
                          : false
                      }
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
                    errors={errors?.audienceAgeGroup ? true : false}
                    name="audienceTarget"
                    message={
                      errors?.audienceAgeGroup && errors.audienceAgeGroup
                    }
                  />
                </FormContainer>
              </>
            )}

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
                      <input
                        checked={values.visibility === data.title}
                        onChange={() => {
                          if (data?.title === "coming soon") {
                            setFieldValue("visibility", data.title);
                            setFieldValue("access", "free");
                            setFieldValue("featured", false);
                          } else {
                            setFieldValue("visibility", data.title);
                            setFieldValue("enableDonation", false);
                          }
                        }}
                        name="visibility"
                        type="radio"
                        id={data.title}
                      />
                      <label htmlFor={data.title}>{data.title}</label>
                    </div>
                  );
                })}
              </CustomStack>

              <ErrorMessage
                errors={errors?.visibility ? true : false}
                name="visibility"
                message={errors?.visibility && errors.visibility}
              />
            </FormContainer>

            {type !== "episode" && values.visibility !== "coming soon" && (
              <>
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
                    {values?.type === "series" ? (
                      <>
                        <div className="flex relative h-5 items-center gap-3">
                          <input
                            checked={values.access === "free"}
                            onChange={() => setFieldValue("access", "free")}
                            name="access"
                            type="radio"
                            id={"free"}
                          />
                          <label className="capitalize" htmlFor={"free"}>
                            {"Free"}
                          </label>
                        </div>
                      </>
                    ) : (
                      <>
                        {accessData.map((data, index) => {
                          return (
                            <div
                              key={data.title}
                              className="flex relative h-5 items-center gap-3"
                            >
                              <input
                                checked={values.access === data.title}
                                onChange={() =>
                                  setFieldValue("access", data.title)
                                }
                                name="access"
                                type="radio"
                                id={data.title}
                              />
                              <label
                                className="capitalize"
                                htmlFor={data.title}
                              >
                                {data.title}
                              </label>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </CustomStack>

                  <ErrorMessage
                    errors={errors?.access ? true : false}
                    name="access"
                    message={errors?.access && errors.access}
                  />
                </FormContainer>
              </>
            )}

            {/** Duration */}
            {/* {values.access === "rent" && (
              <FormContainer className="gap-2  border-t-secondary-500 pb-4">
                <CustomStack className="flex-col ">
                  <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                    Duration (in hours)
                  </Typography>
                  <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                    How long will you rent this film?
                  </Typography>

                  <CustomStack className="flex-col gap-2 mt-2 text-[#f2f2f2]">
                    <input
                      id="duration"
                      type="text"
                      placeholder="Duration e.g 24"
                      value={values.duration}
                      onChange={handleChange}
                    />
                  </CustomStack>

                  <ErrorMessage
                    errors={errors?.duration ? true : false}
                    name="duration"
                    message={errors?.duration && errors.duration}
                  />
                </CustomStack>
              </FormContainer>
            )} */}

            {values.visibility === "coming soon" && type !== "episode" && (
              <>
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
                    <div className="flex relative h-5 items-center gap-3">
                      <input
                        checked={values.enableDonation === true}
                        onChange={(e) => {
                          setFieldValue("enableDonation", e.target.checked);
                        }}
                        name="enableDonation"
                        type="checkbox"
                        id={"enableDonation"}
                      />
                      <label htmlFor={"enableDonation"}>Enable Donations</label>
                    </div>
                  </CustomStack>

                  <ErrorMessage
                    errors={errors?.enableDonation ? true : false}
                    name="enableDonation"
                    message={errors?.enableDonation && errors.enableDonation}
                  />
                </FormContainer>

                <FormContainer className="gap-2  border-t-secondary-500 pb-4">
                  <CustomStack htmlFor="donationTarget" className="flex-col ">
                    <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                      Donations Target Amount
                    </Typography>
                    <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                      Total amount of donations to be collected from viewers
                    </Typography>
                  </CustomStack>
                  {/** radio buttons */}
                  <CustomStack className="flex-col gap-2 mt-2 text-[#f2f2f2]">
                    <input
                      id="donationTargetAmount"
                      type="number"
                      placeholder="donationTargetAmount e.g 1000000"
                      value={values.donationTargetAmount}
                      onChange={handleChange}
                    />
                  </CustomStack>

                  <ErrorMessage
                    errors={errors?.enableDonation ? true : false}
                    name="enableDonation"
                    message={errors?.enableDonation && errors.enableDonation}
                  />
                </FormContainer>

                <FormContainer className="gap-2  border-t-secondary-500 pb-4">
                  <CustomStack htmlFor="donationTarget" className="flex-col ">
                    <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
                      Donations Deadline
                    </Typography>
                    <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
                      Set Period for Donation
                    </Typography>
                  </CustomStack>
                  {/** radio buttons */}
                  <CustomStack className="flex-col gap-2 mt-2 text-[#f2f2f2]">
                    <input
                      id="donationDeadline"
                      type="datetime-local"
                      placeholder="donationDeadline e.g 2023-01-01T00:00:00"
                      value={values.donationDeadline}
                      onChange={handleChange}
                      className="text-whites-40"
                    />
                  </CustomStack>

                  <ErrorMessage
                    errors={errors?.enableDonation ? true : false}
                    name="enableDonation"
                    message={errors?.enableDonation && errors.enableDonation}
                  />
                </FormContainer>
              </>
            )}

            {type !== "episode" && values.visibility !== "coming soon" && (
              <>
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
                    <div className="flex relative h-5 items-center gap-3">
                      <input
                        checked={values.featured === true}
                        onChange={(e) => {
                          setFieldValue("featured", e.target.checked);
                        }}
                        name="featuredFilm"
                        type="checkbox"
                        id={"featured"}
                      />
                      <label htmlFor={"featured"}>Featured </label>
                    </div>
                  </CustomStack>

                  <ErrorMessage
                    errors={errors?.featured ? true : false}
                    name="enableDonation"
                    message={errors?.featured && errors.featured}
                  />
                </FormContainer>
              </>
            )}
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default Audience;
