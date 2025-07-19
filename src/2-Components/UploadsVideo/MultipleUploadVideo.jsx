import React from "react";
import MultipleVideoForm from "./MultipleVideoForm";
import Button from "../Buttons/Button";
import { queryClient } from "../../lib/tanstack";
import apiRequest from "../../3-Middleware/apiRequest";
import { Alert, Typography } from "@mui/material";

const MultipleUploadVideo = ({
  videoType,
  film,
  type,
  setErrorUpload,
  setSucessUpload,
  errorUpload,
  sucessUpload,
}) => {
  const [openVideoModal, setOpenVideoModal] = React.useState(false);
  const [existingJob, setExistingJob] = React.useState(null);
  const [checkingJob, setCheckingJob] = React.useState(false);

  const checkExistingJob = async () => {
    if (!film?.id) return;
    
    setCheckingJob(true);
    try {
      const response = await apiRequest.get('/v1/studio/processing-jobs/check-existing', {
        params: {
          resourceId: film.id,
          type: type === 'episode' ? 'episode' : 'film'
        }
      });
      
      if (response.data.hasExistingJob) {
        setExistingJob(response.data.existingJob);
      } else {
        setExistingJob(null);
      }
    } catch (error) {
      console.error('Error checking existing job:', error);
      setExistingJob(null);
    } finally {
      setCheckingJob(false);
    }
  };

  React.useEffect(() => {
    checkExistingJob();
  }, [film?.id, type]);

  const handleVideoModalOpen = () => {
    if (existingJob) {
      setErrorUpload(`Cannot upload: There's already a ${existingJob.status} job for this resource (${existingJob.fileName})`);
      return;
    }
    
    setOpenVideoModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  
  const handleVideoModalClose = async (type) => {
    setOpenVideoModal(() => false);
    setErrorUpload(null);
    setSucessUpload(null);
    document.body.style.overflow = "unset";
    if (type === "success") {
      await queryClient.invalidateQueries({
        queryKey: ["film", film?.id],
      });
      // Re-check for existing jobs after successful upload
      await checkExistingJob();
    }
  };

  return (
    <div className="flex flex-col  gap-6">
      <div className="flex items-center gap-8 max-w-[80%]">
        <div className="flex flex-col gap-[7px] min-w-[150px]">
          <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
            Multiple Version Video Upload
          </h1>
          <p className="font-[Inter-Regular] text-base text-[#706E72]">
            Please upload a file that contains a digital video in 4 formats will
            be extracted from the video.
          </p>
        </div>

        <div className="">
          <Button
            onClick={() => {
              handleVideoModalOpen();
            }}
            className="w-max min-w-[150px]"
            disabled={checkingJob || !!existingJob}
          >
            {checkingJob ? 'Checking...' : existingJob ? 'Upload Blocked' : 'Upload File'}
          </Button>
        </div>
      </div>

      {/* Show existing job warning */}
      {existingJob && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Upload Blocked:</strong> There's already a {existingJob.status} processing job for this resource.
            <br />
            <strong>File:</strong> {existingJob.fileName} | <strong>Progress:</strong> {existingJob.progress}%
            <br />
            <strong>Created:</strong> {new Date(existingJob.createdAt).toLocaleString()}
          </Typography>
        </Alert>
      )}

      <div className="flex flex-col gap-5">
        {/** FILM */}
        <div className="flex flex-col gap-[20px]">
          <div className="bg-[#36323E] w-[500px] h-[266px] flex items-center justify-center text-whites-40 font-[Inter-SemiBold] text-base sm:text-lg">
            {" "}
            No Videos Uploaded
          </div>

          
        </div>
      </div>

      {openVideoModal && (
        <MultipleVideoForm
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

export default MultipleUploadVideo;
