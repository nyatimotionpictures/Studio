import { Form, Formik } from "formik";
import React from "react";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../5-Store/TanstackStore/services/api";
import { Alert, Snackbar } from "@mui/material";
import * as yup from "yup";
import Button from "../Buttons/Button";
import ErrorMessage from "../Forms/ErrorMessage";

const UserPasswordTab = ({user}) => {
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [viewOldPassword, setViewOldPassword] = React.useState(false);
  const [viewNewPassword, setViewNewPassword] = React.useState(false);

  console.log("user", user)
  const updatePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: async (data) => {
      setSnackbarMessage({ message: data.message, severity: "success" });
      //await queryClient.invalidateQueries({ queryKey: ["film", data?.film?.id] });
      //await
    },
    onError: (error) => {
      setSnackbarMessage({
        message: error?.message,
        severity: "error",
      });
    },
  });

  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required("required"),
    password: yup.string().required("required"),
    adminId: yup.string().required("required"),
  });

  const initialValues = {
    oldPassword: "",
    password: "",
    adminId: user?.id,
  };

  const handleOldPasswordView = (e) => {
    setViewOldPassword(() => !viewOldPassword);
  };

  const handleNewPasswordView = (e) => {
    setViewNewPassword(() => !viewNewPassword);
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        //console.log(values)
        updatePasswordMutation.mutate(values);
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue,
      }) => (
        <Form>
          <CustomStack className="h-full w-full flex flex-col gap-5 text-whites-40">
            <div className="flex  items-center gap-10">
              {/** Account ID */}
              <FormContainer>
                <label
                  htmlFor="oldPassword"
                  className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                >
                  Old Password
                </label>
                <div className="flex flex-col gap-2 h-max relative justify-center">
                  <input
                    id="oldPassword"
                    type={viewOldPassword ? "text" : "password"}
                    value={values.oldPassword}
                    name="oldPassword"
                    onChange={handleChange}
                    placeholder="oldPassword"
                  />

<div className=" w-max flex items-center justify-center px-0 py-0  absolute text-whites-40 right-3  m-auto hover:text-primary-500  z-50">
                    {!viewOldPassword ? (
                      <span
                        onClick={handleOldPasswordView}
                        className="icon-[solar--eye-closed-outline] w-6 h-6"
                      ></span>
                    ) : (
                      <span
                        onClick={handleOldPasswordView}
                        className="icon-[solar--eye-line-duotone] w-6 h-6"
                      ></span>
                    )}
                  </div>
                </div>

                <ErrorMessage
                  errors={
                    touched?.oldPassword && errors?.oldPassword ? true : false
                  }
                  name="oldPassword"
                  message={errors?.oldPassword && errors.oldPassword}
                />
              </FormContainer>

              {/** title */}
              <FormContainer>
                <label
                  htmlFor="newPassword"
                  className="label font-[Inter-Regular] text-base text-whites-100 text-opacity-75"
                >
                  new Password
                </label>

                <div className="flex flex-col gap-2 h-full relative justify-center">
                  <input
                    id="newPassword"
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    type={viewNewPassword ? "text" : "password"}
                    placeholder="New Password "
                  />

                  <div className=" w-max flex items-center justify-center px-0 py-0  absolute text-whites-40 right-3  m-auto hover:text-primary-500  z-50">
                    {!viewNewPassword ? (
                      <span
                        onClick={handleNewPasswordView}
                        className="icon-[solar--eye-closed-outline] w-6 h-6"
                      ></span>
                    ) : (
                      <span
                        onClick={handleNewPasswordView}
                        className="icon-[solar--eye-line-duotone] w-6 h-6"
                      ></span>
                    )}
                  </div>
                </div>

                <ErrorMessage
                  errors={
                    touched?.password && errors?.password ? true : false
                  }
                  name="newPassword"
                  message={errors?.password && errors.password}
                />
              </FormContainer>
            </div>

            <div className="flex  justify-end items-center gap-10">
              <div>
                {updatePasswordMutation.isPending ? (
                  <Button
                    disabled
                    className="w-max min-w-[150px] px-4 rounded-full"
                  >
                    Submitting...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-max min-w-[150px] px-4 rounded-full"
                  >
                    Change Password
                  </Button>
                )}
              </div>
            </div>

            {/** snackbar */}
            <Snackbar
              open={snackbarMessage !== null}
              autoHideDuration={6000}
              onClose={() => setSnackbarMessage(null)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={snackbarMessage?.severity} variant="filled">
                {snackbarMessage?.message}
              </Alert>
            </Snackbar>
          </CustomStack>
        </Form>
      )}
    </Formik>
  );
};

export default UserPasswordTab;
