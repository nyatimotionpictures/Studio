import React from "react";
import Button from "../Buttons/Button";
import TrailerForm from "./TrailerForm";
import { queryClient } from "../../lib/tanstack";
import apiRequest from "../../3-Middleware/apiRequest";
import { Alert, Typography } from "@mui/material";

const TrailerUploadVideo = ({
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
          type: type === 'episode' ? 'episode' : 'film',
          jobType: 'trailer_processing' // Specifically check for trailer processing jobs
        }
      });
      
      if (response.data.hasExistingJob) {
        setExistingJob(response.data.existingJob);
      } else {
        setExistingJob(null);
      }
    } catch (error) {
      console.error('Error checking existing trailer job:', error);
      setExistingJob(null);
    } finally {
      setCheckingJob(false);
    }
  };

  React.useEffect(() => {
    checkExistingJob();
  }, [film?.id, type]);

  const handleVideoModalOpen = () => {
    if (existingJob && existingJob.jobType === 'trailer_processing') {
      setErrorUpload(`Cannot upload: There's already a ${existingJob.status} trailer processing job for this resource (${existingJob.fileName})`);
      return;
    }
    
    setOpenVideoModal(() => true);
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };
  
  const handleVideoModalClose = async (type) => {
    setErrorUpload(() => null);
    setSucessUpload(() => null);
    
    setOpenVideoModal(() => false);
  
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
            disabled={checkingJob || (existingJob && existingJob.jobType === 'trailer_processing')}
          >
            {checkingJob ? 'Checking...' : (existingJob && existingJob.jobType === 'trailer_processing') ? 'Upload Blocked' : 'Upload File'}
          </Button>
        </div>
      </div>

      {/* Show existing trailer job warning */}
      {existingJob && existingJob.jobType === 'trailer_processing' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Upload Blocked:</strong> There's already a {existingJob.status} trailer processing job for this resource.
            <br />
            <strong>File:</strong> {existingJob.fileName} | <strong>Progress:</strong> {existingJob.progress}%
            <br />
            <strong>Job Type:</strong> {existingJob.jobType}
            <br />
            <strong>Created:</strong> {new Date(existingJob.createdAt).toLocaleString()}
            {existingJob.jobId && (
              <>
                <br />
                <strong>Job ID:</strong> {existingJob.jobId}
              </>
            )}
          </Typography>
        </Alert>
      )}

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
