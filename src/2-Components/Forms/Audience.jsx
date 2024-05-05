import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Typography } from "@mui/material";
import ratedGImg from '../../1-Assets/ratings/RatedG.svg'
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
            <FormContainer className="gap-2">
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

              <CustomStack>
                <CustomRatingButton
                  ratedId={"ratedG"}
                  btntitle={"GENERAL AUDIENCES"}
                  radiogroupName={"filmRating"}
                  btnText={
                    "Nothing that would offend parents for viewing by children."
                  }
                  btnImg={ratedGImg}
                />
              </CustomStack>
            </FormContainer>
            {/** type */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Directors (required)
              </label>
              <input />
            </FormContainer>

            {/** runtime */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Producers (required)
              </label>
              <input />
            </FormContainer>

            {/** Year of Production */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Writers (required)
              </label>
              <input />
            </FormContainer>

            {/** Year of Production */}
            <FormContainer>
              <label className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75">
                Sound Core (required)
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
