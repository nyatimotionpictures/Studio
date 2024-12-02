import { useTheme, Box, Stack, Typography } from "@mui/material";

import Button from "../../../2-Components/Buttons/Button.tsx";
import * as yup from "yup";
import { Formik, Form } from "formik";
import logo from "../../../1-Assets/logos/Logo.svg";
import heroImage from "../../../1-Assets/Hero.png";
import {
    FormContainer,
    SingleWrapper,
} from "../../../2-Components/Stacks/InputFormStack.jsx";
import { styled } from "@mui/system";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postAdminRegister } from "../../../5-Store/TanstackStore/services/api.ts";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//import apiRequest from "../../../3-Middleware/apiRequest.js";
//import axios from "axios";

const Register = () => {
    let routeNavigate = useNavigate();
    const mutation = useMutation({
        mutationFn: postAdminRegister,
        onSuccess: (data) => {
            alert(`Welcome Registerd ${data.message}`)
            routeNavigate("/login", { replace: true });
        },
        onError: (error) => {
            alert(`registration failed ${error.message  }`);
            console.log(error)
        }
    })

    // const { updateUser } = useContext(AuthContext)

    const initialValues = {
        email: "",
        firstname: "",
        lastname: "",
        phoneNumber: "",
        password: "",
        role: "",
        privileges:"admin"
    };

    const validationSchema = yup.object().shape({
        email: yup.string().required("required"),
        firstname: yup.string().required("required"),
        lastname: yup.string().required("required"),
        phoneNumber: yup.string().required("required"),
        password: yup.string().required("password is required"),
        role: yup.string().required("role is required"),
        privileges: yup.string().required("role is required"),
    });

    return (
        <div className="min-h-screen w-full flex flex-row gap-0 ">
            {/** form */}
            <div
              
                className="bg-secondary-900 w-full min-h-[100vh] py-5  flex justify-center items-center"
            >
                <Formik
                    validationSchema={validationSchema}
                    initialValues={initialValues}
                    onSubmit={async (values, helpers) => {
                        
                         mutation.mutate(values)
                      
                    }}
                >
                    {({ values, handleChange, errors, handleSubmit, setFieldValue,setErrors }) => (
                        <Form>
                            <Stack>
                                <Box className="absolute top-[34px] left-10">
                                    <img src={logo} alt={"Nyati Films"} />
                                </Box>
                                <Stack spacing="22px">
                                    <Stack className="gap-2">
                                        <Typography
                                            variant="h1"
                                            className="text-whites-200  text-[26px] text-center select-none font-[Inter-Bold]"
                                        >
                                            Create  Admin account
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            className="text-whites-40 text-[14px] text-center select-none font-[Inter-Regular]"
                                        >
                                            Enter admin user details
                                            {/* <span className="text-primary-500 cursor-pointer" onClick={() => routeNavigate("/login", { replace: true })}>Log in</span> */}
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={"10px"}>
                                        {/** Email */}
                                        <SingleWrapper>
                                            <FormContainer>
                                                <label className="text-[#bdb8b8] text-[12.56px]">
                                                    Email
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
                                        {/** firstname */}
                                        <SingleWrapper>
                                            <FormContainer>
                                                <label className="text-[#bdb8b8] text-[12.56px]">
                                                    firstname
                                                </label>
                                                <input
                                                    name="firstname"
                                                    value={values.firstname}
                                                    className="text-[#ffffff] text-[14.35px] font-[Inter-Medium]"
                                                    onChange={handleChange}
                                                />
                                                {errors && errors.firstname && (
                                                    <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                                                        {errors.firstname}
                                                    </Typography>
                                                )}
                                            </FormContainer>
                                        </SingleWrapper>
                                        {/** lastname */}
                                        <SingleWrapper>
                                            <FormContainer>
                                                <label className="text-[#bdb8b8] text-[12.56px]">
                                                    lastname
                                                </label>
                                                <input
                                                    name="lastname"
                                                    value={values.lastname}
                                                    className="text-[#ffffff] text-[14.35px] font-[Inter-Medium]"
                                                    onChange={handleChange}
                                                />
                                                {errors && errors.lastname && (
                                                    <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                                                        {errors.lastname}
                                                    </Typography>
                                                )}
                                            </FormContainer>
                                        </SingleWrapper>

                                        {/** phoneNumber */}
                                        <SingleWrapper>
                                            <FormContainer>
                                                <label className="text-[#bdb8b8] text-[12.56px]">
                                                    PhoneNumber
                                                </label>
                                               

                                                <PhoneInput
                                                    defaultErrorMessage="Check number"
                                                    country={'ug'}
                                                    specialLabel="Number"
                                                    className="!bg-[#36323e]"
                                                    countryCodeEditable={false}
                                                    value={values.phoneNumber}
                                                    onChange={(phone, country) => {
                                                        //setFieldValue("phonenumber", phone)
                                                        if (country.name === "Uganda" && phone.length > 12) {
                                                            setErrors({
                                                                ...errors,
                                                                phoneNumber: "Dont start with zero.Please check your number"
                                                            })

                                                        }
                                                        else {
                                                            setFieldValue("phoneNumber", phone)
                                                        }
                                                    }}
                                                    inputProps={{
                                                        name: "phonenumber",
                                                        enableSearch: true,
                                                        countryCodeEditable: false,
                                                        placeholder: "i.e 787 *** ***"
                                                    }}

                                                    containerClass="phoneInputContainer"
                                                    inputClass="phoneInput"
                                                />
                                                {errors && errors.phoneNumber && (
                                                    <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                                                        {errors.phoneNumber}
                                                    </Typography>
                                                )}
                                            </FormContainer>
                                        </SingleWrapper>
                                        {/** Role */}
                                        <SingleWrapper>
                                            <FormContainer>
                                                <label className="text-[#bdb8b8] text-[12.56px]">
                                                    Role
                                                </label>
                                                <select
                                                    name="role"
                                                    value={values.role}
                                                    className="text-[#ffffff] text-[14.35px] font-[Inter-Medium]"
                                                    onChange={(e) => {
                                                        
                                                        setFieldValue("role", e.target.value)
                                                       

                                                    }}
                                                >
                                                     <option value="">choose option</option>
                                                    <option value="admin">Admin</option>
                                                    {/* <option value="user"></option> */}
                                                </select>
                                                {errors && errors.role && (
                                                    <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                                                        {errors.role}
                                                    </Typography>
                                                )}
                                            </FormContainer>
                                        </SingleWrapper>

                                        
                                        {/** password */}
                                        <SingleWrapper>
                                            <FormContainer>
                                                <label className="text-[#bdb8b8] text-[12.56px]">
                                                    Password
                                                </label>
                                                <input
                                                    type={"password"}
                                                    name="password"
                                                    className="text-[#ffffff] font-[Inter-Medium] text-[14.35px]"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                />
                                                {errors && errors.password && (
                                                    <Typography className="text-[red] font-[Segoe-UI] text-[13px]">
                                                        {errors.password}
                                                    </Typography>
                                                )}
                                            </FormContainer>
                                        </SingleWrapper>


                                    </Stack>

                                    <Stack spacing="18px">
                                        <Button
                                            onClick={handleSubmit}
                                            type="button"
                                            className="rounded-full py-2 px-4 text-[14.35px] "
                                            variant="default"
                                        >
                                            Register
                                        </Button>


                                    </Stack>
                                </Stack>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </div>

            {/** bgImage */}
            <Box className="min-h-[100vh] flex-grow w-[30%]">
                <ImageBgContent className="min-h-[100vh] h-full w-full">
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
    )
}

export default Register

const ImageBgContent = styled(Box)({
    background: `linear-gradient(
      to top,
      rgba(20, 17, 24, 1),
      rgba(20, 17, 24, 0.729)
    ),
    url(${heroImage}) left/cover no-repeat`,
});