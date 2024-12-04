import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import PosterForm from "./PosterForm";
import BackdropForm from "./BackdropForm";
import { useMutation } from "@tanstack/react-query";
import { deletePoster } from "../../5-Store/TanstackStore/services/api";
import { useDeletePoster } from "../../5-Store/TanstackStore/services/mutations";
import { queryClient } from "../../lib/tanstack";
import { useParams } from "react-router-dom";

const Thumbnails = ({ film, type }) => {
  const [posterDeleteId, setPosterDeleteId] = React.useState(null);
  const [openPosterModal, setOpenPosterModal] = React.useState(false);
  const [openBackdropModal, setOpenBackdropModal] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  let params = useParams();

  console.log(film)

  const [posterData, setPosterData] = React.useState([]);
  const [backdropData, setBackdropData] = React.useState([]);

  //console.log("film", film);

  React.useEffect(() => {
    let posterArray = [];
    let backdropArray = [];
    film?.posters?.filter((data, index) => {
      if (data.isCover === true) {
        posterArray.push(data);
      } else {
        backdropArray.push(data);
      }
      return;
    });

    setPosterData(posterArray);
    setBackdropData(backdropArray);
  }, [film?.posters]);

  const handleModalClose = () => {
    setOpenPosterModal(() => false);
    setOpenBackdropModal(() => false);
    document.body.style.overflow = "unset";
  };

  const handleOpenPosterModal = () => {
    setOpenPosterModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  const handleOpenBackdropModal = () => {
    setOpenBackdropModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  let deleteFun = (id) => {
    console.log(id)
    setPosterDeleteId(() => id);
  };

  let cancelDeleteFun = () => {
    setPosterDeleteId(null);
  };

  let deletePosterMutation = useDeletePoster();

  let confirmDeleteFun = (posterId) => {
   // console.log(posterId)
    deletePosterMutation.mutate(posterId, {
      onSuccess: async (data, variables, context) => {
       // console.log("run second");
        setSnackbarMessage({ message: data.message, severity: "success" });
        cancelDeleteFun();
        type === "episode" ? await queryClient.invalidateQueries({ queryKey: ["film", params?.id] }) : await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
      
        
      },
      onError: (error) => {
        console.log("error", error);
        if (error?.message) {
          setSnackbarMessage(() => ({
            message: error.message,
            severity: "error",
          }));
          cancelDeleteFun();
        }
      },
    });
    //cancelDeleteFun()
  };

  return (
    <>
       
      <CustomStack className="h-full w-full flex flex-col gap-5 relative">
   
        {/** Upload poster image */}
        <FormContainer>
          <CustomStack className="flex-col pb-2">
            <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
              Upload poster image
            </Typography>
            <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
              Please upload 3 different posters
            </Typography>
          </CustomStack>

          <CustomStack className="w-full flex-row  gap-6 flex-wrap">
            {/** Images */}
            {posterData?.map((data, index) => {
              return (
                <div key={index} className="flex flex-col gap-[20px]">
                  <img
                    src={data?.url}
                    alt=""
                    className="w-[250.4px] object-cover h-[286.37px]"
                  />
                  <Button
                    onClick={() => deleteFun(data?.id)}
                    className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                  >
                    Delete Photo
                  </Button>
                </div>
              );
            })}

            {/** upload image */}
            {posterData?.length < 3 && (
              <FormContainer
                className="w-max cursor-pointer"
                onClick={handleOpenPosterModal}
              >
                <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[250.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6 text-center">
                  <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                  <CustomStack className="flex-col gap-2 items-center">
                    <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                      <span className="text-primary-500">upload</span>{" "}
                    </Typography>
                    <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                      Your images will be private until you publish the film.
                    </Typography>
                  </CustomStack>
                </CustomStack>
              </FormContainer>
            )}
          </CustomStack>
        </FormContainer>

        {/** Upload Backdrop image */}
        <FormContainer>
          <CustomStack className="flex-col pb-2">
            <Typography className="text-[#F2F2F2] font-[Inter-SemiBold] text-base">
              Upload backdrop image
            </Typography>
            <Typography className="text-[#76757A] font-[Inter-Regular] text-sm">
              Please upload 3 different backdrop images(screenshots from the
              film)
            </Typography>
          </CustomStack>

          <CustomStack className="w-full flex-row  gap-6 flex-wrap">
            {backdropData?.map((data, index) => {
              return (
                <div key={index} className="flex flex-col gap-[20px]">
                  <img
                    src={data?.url}
                    alt=""
                    className="w-[320px] object-cover h-[286.37px]"
                  />
                  <Button
                    onClick={() => deleteFun(data?.id)}
                    className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                  >
                    Delete Photo
                  </Button>
                </div>
              );
            })}

            {/** image 1 */}
            {backdropData?.length < 3 && (
              <FormContainer
                onClick={handleOpenBackdropModal}
                className="w-max cursor-pointer"
              >
                <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
                  <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                  <CustomStack className="flex-col gap-2 items-center">
                    <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                      <span className="text-primary-500">Upload</span>{" "}
                    </Typography>
                    <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                      Your images will be private until you publish the film.
                    </Typography>
                  </CustomStack>
                </CustomStack>
              </FormContainer>
            )}
          </CustomStack>
        </FormContainer>
        
      </CustomStack>

      {openPosterModal && (
        <CustomStack
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="false"
        >
          {/* <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div> */}

          <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden ">
            <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
              <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">
                {/** forms with stepper */}
                <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                  <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                    <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                      Add Poster
                    </Typography>

                    <div className="flex gap-5">
                      <Button
                        onClick={handleModalClose}
                        className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700"
                      >
                        CANCEL & CLOSE
                      </Button>
                    </div>
                  </CustomStack>

                  {/** form */}
                  <div className="flex w-full items-center justify-center h-full">
                    <PosterForm
                      handleModalClose={handleModalClose}
                      film={film}
                      type={type}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomStack>
      )}

      {openBackdropModal && (
        <CustomStack
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="false"
        >
          {/* <div className="fixed inset-0 border rounded-xl bg-secondary-50 bg-opacity-75 transition-opacity"></div>                 */}

          <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
            <div className="relative transform overflow-y-auto rounded-lg bg-secondary-400 h-screen text-left shadow-xl transition-all">
              <div className="bg-secondary-900 px-16 pt-0 min-h-screen h-max">
                {/** video form */}
                {/** <UploadVideo innerref={formRef} />  */}

                {/** forms with stepper */}
                <div className="flex flex-col w-full h-full text-whites-40 gap-6 relative">
                  <CustomStack className="z-50 w-full justify-between items-center py-2 pt-7 sticky top-0 bg-secondary-900">
                    <Typography className="font-[Inter-Medium] text-[#fafafa] text-xl">
                      Add Backdrop
                    </Typography>

                    <div className="flex gap-5">
                      <Button
                        onClick={handleModalClose}
                        className="px-5 rounded-lg font-[Inter-Medium] bg-primary-700"
                      >
                        CANCEL & CLOSE
                      </Button>
                    </div>
                  </CustomStack>

                  {/** stepper show case */}

                  {/** form */}
                  <div className="flex w-full items-center justify-center h-full">
                    <BackdropForm
                      handleModalClose={handleModalClose}
                      film={film}
                      type={type}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomStack>
      )}

        {/** Modal for deleting Film */}
        {posterDeleteId && (
          <CustomStack
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="false"
        >
           <div className="fixed inset-0 z-50 bg-primary-200 bg-opacity-10 overflow-hidden">
           <div className="flex justify-center items-center top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 cursor-pointer">
          <div className="flex flex-col items-center bg-whites-500 text-white rounded-lg p-4 shadow-lg gap-5">
            <div className="text-xl font-bold font-[Inter-Bold]">
              Are you sure you want to delete this?
            </div>
            <div className="flex flex-col items-center bg-whites-500 text-white gap-5">
              {deletePosterMutation.isPending ? (
                <Button className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]">
                  Deleting...
                </Button>
              ) : (
                <>
                  {" "}
                  <Button
                    className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                    onClick={()=>confirmDeleteFun(posterDeleteId)}
                  >
                    Yes
                  </Button>
                  <Button
                    className="bg-secondary-500 hover:bg-secondary-700 text-whites-40 font-bold font-[Inter-SemiBold] py-2 px-4 rounded min-w-[150px]"
                    onClick={cancelDeleteFun}
                  >
                    No
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

           </div>


        </CustomStack>
       
      )}

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
    </>
  );
};

export default Thumbnails;
