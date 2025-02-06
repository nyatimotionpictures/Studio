import React, { useState } from "react";
import CustomStack from "../Stacks/CustomStack";
import { Alert, Snackbar, Typography } from "@mui/material";
import Button from "../Buttons/Button";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { FormContainer } from "../Stacks/InputFormStack";
import ErrorMessage from "../Forms/ErrorMessage";
import axios from "axios";
import { BaseUrl } from "../../3-Middleware/apiRequest";
//import UploadProgress from "../TrackProgress/UploadProgress";
import { queryClient } from "../../lib/tanstack";
import { useParams } from "react-router-dom";
import TrailerForm from "./TrailerForm";

const TrailerUploadVideo = ({
  videoType,
  film,
  type,
  videoPrice,
  setErrorUpload,
  setSucessUpload,
  errorUpload,
  sucessUpload,
}) => {
  const [openVideoModal, setOpenVideoModal] = React.useState(false);
  const handleVideoModalOpen = () => {
    setOpenVideoModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  const handleVideoModalClose = () => {
    setOpenVideoModal(() => false);
    setErrorUpload(null);
    setSucessUpload(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="flex flex-col  gap-6">
      <div className="flex flex-row  gap-8 items-center max-w-[80%]">
        <div className="flex flex-col gap-[7px] min-w-[150px] ">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Trailer
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            You can upload a file that contains full-motion (digital video) that
            is at least 1-3 minute video
          </p>
        </div>

        <div className="">
          <Button
            onClick={() => {
              handleVideoModalOpen();
            }}
            className="w-max min-w-[150px]"
          >
            Upload File
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-[20px]">
          <div className="bg-[#36323E] w-[470px] h-[266px] flex "></div>
        </div>
      </div>

      {openVideoModal && (
        <TrailerForm
          videoType={videoType}
          film={film}
          handleModalClose={handleVideoModalClose}
          type={type}
          setErrorUpload={setErrorUpload}
          setSucessUpload={setSucessUpload}
          errorUpload={errorUpload}
          sucessUpload={sucessUpload}
        />
      )}
    </div>
  );
};

export default TrailerUploadVideo;
