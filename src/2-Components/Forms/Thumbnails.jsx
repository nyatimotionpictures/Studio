import { Form, Formik } from "formik";
import React from "react";
import { useContext } from "react";
import * as yup from "yup";
import CustomStack from "../Stacks/CustomStack";
import { FormContainer } from "../Stacks/InputFormStack";
import { Backdrop, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import PosterForm from "./PosterForm";
import BackdropForm from "./BackdropForm";

const Thumbnails = ({  film }) => {
  
  const [openPosterModal, setOpenPosterModal] = React.useState(false);
  const [openBackdropModal, setOpenBackdropModal] = React.useState(false);

  const [posterData, setPosterData] = React.useState([]);
  const [backdropData, setBackdropData] = React.useState([]);

  React.useEffect(() => {
    let posterArray = [];
    let backdropArray = [];
    film?.poster?.filter((data, index) => {
      if (data.isCover === true) {
        posterArray.push(data);
      } else {
        backdropArray.push(data);
      }
      return;
    });

    setPosterData(posterArray);
    setBackdropData(backdropArray);
  }, [film]);

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

  return (
    <>  
            <CustomStack className="h-full w-full flex flex-col gap-5">
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
                        <Button className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent">
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
                            Your images will be private until you publish the
                            film.
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
                    Please upload 3 different backdrop images(screenshots from
                    the film)
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
                        <Button className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent">
                          Delete Photo
                        </Button>
                      </div>
                    );
                  })}

                  {/** image 1 */}
                  {backdropData?.length < 3 && (
                    <FormContainer onClick={handleOpenBackdropModal} className="w-max cursor-pointer">
                      <CustomStack className="flex flex-col bg-[#36323e] justify-center items-center h-[286.37px] w-[350.4px] border-2 rounded-xl border-dashed border-secondary-300 gap-6">
                        <span className="icon-[solar--upload-minimalistic-linear] w-14 h-14 text-[#76757A]"></span>
                        <CustomStack className="flex-col gap-2 items-center">
                          <Typography className="font-[Inter-SemiBold] text-[#76757A] text-sm">
                            <span className="text-primary-500">Upload</span>{" "}
                          </Typography>
                          <Typography className="font-[Inter-Regular] text-xs text-[#76757A]">
                            Your images will be private until you publish the
                            film.
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
               
               <PosterForm handleModalClose={handleModalClose} film={film} />
                  
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
               
               <BackdropForm handleModalClose={handleModalClose} film={film} />
                  
                </div>
                </div>
              </div>
            </div>
          </div>
        </CustomStack>
      )}
    </>
  );
};

export default Thumbnails;
