import { Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import Button from "../../../2-Components/Buttons/Button";
import * as yup from "yup";
import { Formik, Form } from "formik";
import logo from "../../../1-Assets/logos/Logo.svg";
import heroImage from "../../../1-Assets/Hero.png";
import {
  FormContainer,
  SingleWrapper,
} from "../../../2-Components/Stacks/InputFormStack.jsx";
import { styled } from "@mui/system";
import { AuthContext } from "../../../5-Store/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postAuthLogin } from "../../../5-Store/TanstackStore/services/api.ts";

const Login = () => {
   let routeNavigate = useNavigate();
   const [errorMessage, setErrorMessage] = React.useState(null)
   const [viewPassword, setViewPassword] = React.useState(false);
   const {updateUser} = useContext(AuthContext)


   const mutation = useMutation({
    mutationFn: postAuthLogin,
onSuccess: (data)=>{
  updateUser(data)
  routeNavigate("/", { replace: true });
},
onError: (error)=>{
  console.log("error", error)
  setErrorMessage(()=> `Login Failed: ${error.message}`)
}
   })

  

  const initialValues = {
    email: "",
    password: "",
    staySignedIn: false
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required("required"),
    password: yup.string().required("password is required"),
  });


  const handlePasswordView = (e) => {
    setViewPassword(() => !viewPassword);
  };

  return (
    <div className="max-h-screen w-full flex flex-row gap-0 ">
      {/** form */}
      <Box
        component={"section"}
        className="bg-secondary-900 w-full h-[100vh] flex justify-center items-center"
      >
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={async (values, helpers) => {
           
            mutation.mutate(values)
           // console.log("values", values)
           // alert("login completed");
          }}
        >
          {({ values, handleChange, errors, handleSubmit }) => (
            <Form>
              <Stack>
                <Box className="absolute top-[34px] left-10">
                  <img src={logo} alt={"Nyati Films"} />
                </Box>
                <Stack spacing="22px">
                  {/** Login Title */}
                  <Stack>
                    <Typography
                      variant="h1"
                      className="text-whites-200  text-[26px] text-center select-none font-[Inter-Bold]"
                    >
                      Sign in to your account
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-whites-200 text-[14px] text-center select-none font-[Inter-SemiBold]"
                    >
                      Login below
                    </Typography>
                  </Stack>

{/** Error Message */}
{errorMessage && (
  <Stack>
            <Typography className="text-primary-500 text-[14px] max-w-[400px]">
              {errorMessage}
            </Typography>

</Stack>
)}

{/** form stacks */}
                  <Stack spacing={"10px"}>
                    <SingleWrapper>
                      <FormContainer>
                        <label className="text-[#bdb8b8] text-[12.56px]">
                          Username or Email
                        </label>
                        <input
                          name="email"
                          value={values.email}
                          className="text-[#ffffff] text-[14.35px] font-[Inter-Medium]"
                          onChange={handleChange}
                        />
                        {errors && errors.email && (
                          <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                            {errors.email}
                          </Typography>
                        )}
                      </FormContainer>
                    </SingleWrapper>
                    <SingleWrapper>
                      <FormContainer>
                        <label className="text-[#bdb8b8] text-[12.56px]">
                          Password
                        </label>
                        <div className="flex flex-col gap-2 h-full relative justify-center">
                        <input
                           type={viewPassword ? "text" : "password"}
                          name="password"
                          className="text-[#ffffff] font-[Inter-Medium] text-[14.35px]"
                          value={values.password}
                          onChange={handleChange}
                        />

<div className=" w-max flex items-center justify-center px-0 py-0  absolute text-whites-40 right-3  m-auto hover:text-primary-500  z-50">
                        {!viewPassword ? (
                          <span
                            onClick={handlePasswordView}
                            className="icon-[solar--eye-closed-outline] w-6 h-6"
                          ></span>
                        ) : (
                          <span
                            onClick={handlePasswordView}
                            className="icon-[solar--eye-line-duotone] w-6 h-6"
                          ></span>
                        )}
                      </div>
                        </div>
                        
                        {errors && errors.password && (
                          <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                            {errors.password}
                          </Typography>
                        )}
                      </FormContainer>
                    </SingleWrapper>
                  </Stack>

                  <Stack spacing="18px">
                    {
                      mutation.isPending ? (<Button
                        disabled
                        className="rounded-full py-2 px-4 text-[14.35px] "
                      >
                        Submitting...
                      </Button>) : ( <Button
                        onClick={handleSubmit}
                        type="button"
                        className="rounded-full py-2 px-4 text-[14.35px] "
                        variant="default"
                      >
                        Sign In
                      </Button>)
                    }
                   

                    <Button
                      type="button"
                      className="mx-auto w-max text-[#ED3F62] underline underline-offset-4 text-[14.35px] hover:opacity-70 p-0 bg-transparent hover:bg-transparent"
                    >
                      Forgot Password
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>

      {/** bgImage */}
      <Box className="h-[100vh] w-[30%]">
        <ImageBgContent className="h-[100vh] w-full">
          {/** 
           <img
            src={heroImage}
            className="h-full w-full object-cover object-left"
            alt={"Nyati Films"}
          />
        
        */}
        </ImageBgContent>
      </Box>
    </div>
  );
};

export default Login;


const ImageBgContent = styled(Box)({
  background: `linear-gradient(
      to top,
      rgba(20, 17, 24, 1),
      rgba(20, 17, 24, 0.729)
    ),
    url(${heroImage}) left/cover no-repeat`,
});