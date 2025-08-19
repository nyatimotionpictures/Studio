import React, { useEffect } from "react";
import Button from "../Buttons/Button";
import VideoUpload from "./VideoUpload";
import { queryClient } from "../../lib/tanstack";
import CustomStack from "../Stacks/CustomStack";
import {
  useDeleteAllVideo,
  useDeleteVideo,
} from "../../5-Store/TanstackStore/services/mutations";
import { Alert, Snackbar, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import CustomLoader from "../Loader/CustomLoader";
import TrailerUploadVideo from "../UploadsVideo/TrailerUploadVideo";
import MultipleUploadVideo from "../UploadsVideo/MultipleUploadVideo";
import VideoProcessingStatus from "../TrackProgress/VideoProcessingStatus";
import apiRequest from "../../3-Middleware/apiRequest";
import ServerStreamingPlayer from "../VideoPlayer/ServerStreamingPlayer";
import axios from "axios";
import { BaseUrl } from "../../3-Middleware/apiRequest";
import socket from "../../lib/socket"; // Add socket import

const ViewTrailerFilm = ({ film, type, isLoading, refetch }) => {
  let params = useParams();
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [videoDeleteId, setVideoDeleteId] = React.useState(null);
  const [videoIds, setVideoIds] = React.useState(null);
  const [existingJob, setExistingJob] = React.useState(null);
  const [checkingJob, setCheckingJob] = React.useState(false);

  const [videoTrailer, setVideoTrailer] = React.useState(null);

  const [videoSD, setVideoSD] = React.useState(null);
  const [videoHD, setVideoHD] = React.useState(null);
  const [videoFHD, setVideoFHD] = React.useState(null);
  const [videoUHD, setVideoUHD] = React.useState(null);
  const [errorUpload, setErrorUpload] = React.useState(null);
  const [sucessUpload, setSucessUpload] = React.useState(null);

  // Subtitle management states
  const [subtitleFile, setSubtitleFile] = React.useState(null);
  const [uploadingSubtitle, setUploadingSubtitle] = React.useState(false);
  const [existingSubtitles, setExistingSubtitles] = React.useState([]);
  const [loadingSubtitles, setLoadingSubtitles] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('eng'); // Default to English
  const [customLanguage, setCustomLanguage] = React.useState(''); // For custom language input
  const [showCustomLanguageInput, setShowCustomLanguageInput] = React.useState(false); // Toggle custom input
  const [subtitleLabel, setSubtitleLabel] = React.useState(''); // For subtitle label input
  const [editingSubtitleId, setEditingSubtitleId] = React.useState(null); // Track which subtitle is being edited
  const [editingLabel, setEditingLabel] = React.useState(''); // Track the label being edited

  // Language options for subtitle upload
  const languageOptions = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'rus', name: 'Russian' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'chi', name: 'Chinese' },
    { code: 'ara', name: 'Arabic' },
    { code: 'hin', name: 'Hindi' },
    { code: 'ben', name: 'Bengali' },
    { code: 'tel', name: 'Telugu' },
    { code: 'tam', name: 'Tamil' },
    { code: 'mar', name: 'Marathi' },
    { code: 'guj', name: 'Gujarati' },
    { code: 'kan', name: 'Kannada' },
    { code: 'mal', name: 'Malayalam' },
    { code: 'urd', name: 'Urdu' },
    { code: 'swa', name: 'Swahili' },
    { code: 'zul', name: 'Zulu' },
    { code: 'xho', name: 'Xhosa' },
    { code: 'afr', name: 'Afrikaans' },
    { code: 'nld', name: 'Dutch' },
    { code: 'swe', name: 'Swedish' },
    { code: 'nor', name: 'Norwegian' },
    { code: 'dan', name: 'Danish' },
    { code: 'fin', name: 'Finnish' },
    { code: 'pol', name: 'Polish' },
    { code: 'cze', name: 'Czech' },
    { code: 'slk', name: 'Slovak' },
    { code: 'hun', name: 'Hungarian' },
    { code: 'rom', name: 'Romanian' },
    { code: 'bul', name: 'Bulgarian' },
    { code: 'hrv', name: 'Croatian' },
    { code: 'srp', name: 'Serbian' },
    { code: 'slv', name: 'Slovenian' },
    { code: 'est', name: 'Estonian' },
    { code: 'lav', name: 'Latvian' },
    { code: 'lit', name: 'Lithuanian' },
    { code: 'tur', name: 'Turkish' },
    { code: 'ell', name: 'Greek' },
    { code: 'heb', name: 'Hebrew' },
    { code: 'fas', name: 'Persian' },
    { code: 'tha', name: 'Thai' },
    { code: 'vie', name: 'Vietnamese' },
    { code: 'ind', name: 'Indonesian' },
    { code: 'msa', name: 'Malay' },
    { code: 'fil', name: 'Filipino' },
    { code: 'tgl', name: 'Tagalog' }
  ];

  const formRef = React.useRef();

  // Load existing subtitles
  const loadExistingSubtitles = async () => {
    if (!film?.id) return;
    
    setLoadingSubtitles(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user !== null && user.token ? user.token : null;

      const response = await axios.get(`${BaseUrl}/v1/streaming/subtitles/${film.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.subtitles) {
        setExistingSubtitles(response.data.subtitles);
      }
    } catch (error) {
      console.error('Error loading subtitles:', error);
      setExistingSubtitles([]);
    } finally {
      setLoadingSubtitles(false);
    }
  };

  // Handle subtitle file selection
  const handleSubtitleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/vtt') {
      setSubtitleFile(file);
      
      // Auto-detect language from filename
      const filename = file.name.toLowerCase();
      let detectedLanguage = 'eng'; // Default fallback
      
      // Check for language patterns in filename
      for (const lang of languageOptions) {
        if (filename.includes(lang.code.toLowerCase()) || 
            filename.includes(lang.name.toLowerCase())) {
          detectedLanguage = lang.code;
          break;
        }
      }
      
      // Set the detected language
      setSelectedLanguage(detectedLanguage);
      console.log(`🌍 Auto-detected language from filename: ${detectedLanguage}`);
      
    } else {
      setSnackbarMessage({ 
        message: "Please select a valid .vtt subtitle file", 
        severity: "error" 
      });
    }
  };

  // Helper function to get language name from code
  const getLanguageName = (code) => {
    if (code === 'custom' && customLanguage) {
      return `Custom (${customLanguage})`;
    }
    const language = languageOptions.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  // Get the final language code to send to backend
  const getFinalLanguageCode = () => {
    if (selectedLanguage === 'custom' && customLanguage.trim()) {
      return customLanguage.trim().toLowerCase();
    }
    return selectedLanguage;
  };

  // Handle language selection change
  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setSelectedLanguage(value);
    if (value === 'custom') {
      setShowCustomLanguageInput(true);
    } else {
      setShowCustomLanguageInput(false);
      setCustomLanguage('');
    }
  };

  // Upload subtitle file
  const uploadSubtitle = async () => {
    if (!subtitleFile || !film?.id) return;

    setUploadingSubtitle(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user !== null && user.token ? user.token : null;

      const formData = new FormData();
      formData.append('subtitleFile', subtitleFile);
      formData.append('resourceId', film.id);
      formData.append('type', type === 'episode' ? 'episode' : 'film');
      formData.append('language', getFinalLanguageCode()); // Add selected language
      formData.append('label', subtitleLabel); // Add subtitle label

      console.log("subtitle formdata", subtitleFile);
      console.log("selected language", selectedLanguage);
      console.log("subtitle label", subtitleLabel);

      const response = await axios.post(`${BaseUrl}/v1/studio/upload-subtitle`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbarMessage({ 
        message: `Subtitle uploaded successfully in ${getLanguageName(getFinalLanguageCode())}`, 
        severity: "success" 
      });
      
      // Reload subtitles
      await loadExistingSubtitles();
      setSubtitleFile(null);
      setSubtitleLabel(''); // Clear label input
      
      // Clear file input
      const fileInput = document.getElementById('subtitle-file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading subtitle:', error);
      if (error?.response) {
        setSnackbarMessage({ 
          message: `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`, 
          severity: "error" 
        });
      } else if (error.request) {
        setSnackbarMessage({ 
          message: "No response from server. Please check your network connection.", 
          severity: "error" 
        });
      } else {
        setSnackbarMessage({ 
          message: `Request failed: ${error.message}`, 
          severity: "error" 
        });
      }
    } finally {
      setUploadingSubtitle(false);
    }
  };

  // Delete subtitle
  const deleteSubtitle = async (subtitleId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user !== null && user.token ? user.token : null;

      await axios.delete(`${BaseUrl}/v1/studio/delete-subtitle/${subtitleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage({ 
        message: "Subtitle deleted successfully", 
        severity: "success" 
      });
      await loadExistingSubtitles();
    } catch (error) {
      console.error('Error deleting subtitle:', error);
      if (error?.response) {
        setSnackbarMessage({ 
          message: `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`, 
          severity: "error" 
        });
      } else if (error.request) {
        setSnackbarMessage({ 
          message: "No response from server. Please check your network connection.", 
          severity: "error" 
        });
      } else {
        setSnackbarMessage({ 
          message: `Request failed: ${error.message}`, 
          severity: "error" 
        });
      }
    }
  };

  // Start editing subtitle label
  const startEditSubtitle = (subtitle) => {
    setEditingSubtitleId(subtitle.id);
    setEditingLabel(subtitle.label || '');
  };

  // Cancel editing subtitle label
  const cancelEditSubtitle = () => {
    setEditingSubtitleId(null);
    setEditingLabel('');
  };

  // Save edited subtitle label
  const saveEditSubtitle = async (subtitleId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user !== null && user.token ? user.token : null;

      await axios.put(`${BaseUrl}/v1/studio/update-subtitle/${subtitleId}`, {
        label: editingLabel
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSnackbarMessage({ 
        message: "Subtitle label updated successfully", 
        severity: "success" 
      });
      
      // Reload subtitles
      await loadExistingSubtitles();
      setEditingSubtitleId(null);
      setEditingLabel('');
    } catch (error) {
      console.error('Error updating subtitle:', error);
      if (error?.response) {
        setSnackbarMessage({ 
          message: `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`, 
          severity: "error" 
        });
      } else if (error.request) {
        setSnackbarMessage({ 
          message: "No response from server. Please check your network connection.", 
          severity: "error" 
        });
      } else {
        setSnackbarMessage({ 
          message: `Request failed: ${error.message}`, 
          severity: "error" 
        });
      }
    }
  };

  const checkExistingJob = async () => {
    if (!film?.id) return;
    
    setCheckingJob(true);
    try {
      const response = await apiRequest.get('/v1/studio/processing-jobs/check-existing', {
        params: {
          resourceId: film.id,
          type: type === 'episode' ? 'episode' : 'film'
          // Remove jobType filter to check for all processing jobs (both video and trailer)
        }
      });
      
      if (response.data.hasExistingJob) {
        setExistingJob(response.data.existingJob);
        console.log('🎬 Found existing job:', response.data.existingJob);
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

  // Re-check for existing jobs when film data changes
  useEffect(() => {
    checkExistingJob();
  }, [film?.id, type]);

  // Re-check for existing jobs after successful uploads
  useEffect(() => {
    if (sucessUpload) {
      // Wait a bit for the job to be created, then re-check
      setTimeout(() => {
        checkExistingJob();
      }, 2000);
    }
  }, [sucessUpload]);

  // Socket listeners for trailer processing job completion
  useEffect(() => {
    if (!film?.id) return;

    socket.connect();

    // Listen for trailer processing job completion
    socket.on("JobCompleted", ({ message, jobId, hlsUrl }) => {
      console.log('✅ Job completed in ViewTrailerFilm:', { message, jobId, hlsUrl });
      
      if (message.includes("Trailer processing finished")) {
        setSnackbarMessage({ 
          message: "Trailer processing completed successfully!", 
          severity: "success" 
        });
        
        // Refresh film data to show the new trailer
        setTimeout(() => {
          if (refetch) refetch();
          queryClient.invalidateQueries({ queryKey: ["film", film.id] });
          checkExistingJob(); // Re-check job status
        }, 1000);
      }
    });

    // Listen for trailer processing job failure
    socket.on("JobFailed", ({ message, jobId, error }) => {
      console.error('❌ Job failed in ViewTrailerFilm:', { message, jobId, error });
      
      if (message.includes("Trailer processing failed")) {
        setSnackbarMessage({ 
          message: `Trailer processing failed: ${error || 'Unknown error'}`, 
          severity: "error" 
        });
        
        // Re-check job status
        setTimeout(() => {
          checkExistingJob();
        }, 1000);
      }
    });

    return () => {
      socket.off("JobCompleted");
      socket.off("JobFailed");
      socket.disconnect();
    };
  }, [film?.id, refetch]);

  // Load subtitles when videos are available
  useEffect(() => {
    const hasVideos = videoSD || videoHD || videoFHD || videoUHD || videoTrailer;
    if (hasVideos && film?.id) {
      loadExistingSubtitles();
    }
  }, [videoSD, videoHD, videoFHD, videoUHD, videoTrailer, film?.id]);

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    } else {
      alert("No form");
    }
  };

  useEffect(() => {
    if (type !== "season"){
      if (film?.video?.length > 0) {
        film?.video?.filter((data) => {
          console.log("🎬 Video data:", data);
          if (data.isTrailer === true && data.resolution === "HD") {
            setVideoTrailer(data);
            console.log("🎬 Trailer video set:", data);
          }
  
          if (data?.resolution?.toLowerCase() === "sd") {
            setVideoSD(data);
            console.log("🎬 SD video set:", data);
          }
          if (data?.resolution?.toLowerCase() === "hd" && data.isTrailer === false) {
            setVideoHD(data);
            console.log("🎬 HD video set:", data);
          }
          if (data?.resolution?.toLowerCase() === "fhd") {
            setVideoFHD(data);
            console.log("🎬 FHD video set:", data);
          }
          if (data?.resolution?.toLowerCase() === "uhd") {
            setVideoUHD(data);
            console.log("🎬 UHD video set:", data);
          }
        });
      } else {
        setVideoTrailer(null);
        setVideoSD(null);
        setVideoHD(null);
        setVideoFHD(null);
        setVideoUHD(null);
      }
    }else {
      if (film?.trailers?.length > 0) {
       
        setVideoTrailer(film?.trailers[0]);
        console.log("🎬 Season trailer video set:", film?.trailers[0]);
      }else {
        setVideoTrailer(null);
      }
    }

  }, [film, isLoading]);

  let deleteFun = (id) => {
    console.log(id);
    setVideoDeleteId(() => id);
  };

  let cancelDeleteFun = () => {
    setVideoDeleteId(() => null);
  };

  //Delete All Videos
  let deleteAllVideosMutation = useDeleteAllVideo();

  let deleteAllVideos = (ids) => {
   
    let videostoDelete = {
      videoIds: ids,
    }
    setVideoIds(() => (videostoDelete))
  }

  let cancelAllDeleteFun = () => {
    setVideoIds(() => null);
  };

  let confirmDeleteAllFun = (ids) => {
    // console.log(posterId)
    deleteAllVideosMutation.mutate(ids, {
      onSuccess: async (data, variables, context) => {
        setSnackbarMessage({ message: data.message, severity: "success" });
         
        setVideoTrailer(() => null);
        setVideoSD(() => null);
        setVideoHD(() => null);
        setVideoUHD(() => null);
        setVideoFHD(() => null);
        cancelAllDeleteFun();
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
      },
      onError: (error) => {
        if (error?.message) {
          setSnackbarMessage(() => ({
            message: error.message,
            severity: "error",
          }));
          cancelAllDeleteFun();
        }
      },
    });
    //cancelDeleteFun()
  };



  let deleteVideoMutation = useDeleteVideo();

  let confirmDeleteFun = (posterId) => {
    // console.log(posterId)
    deleteVideoMutation.mutate(posterId, {
      onSuccess: async (data, variables, context) => {
        setSnackbarMessage({ message: data.message, severity: "success" });
        setVideoTrailer(() => null);
        setVideoSD(() => null);
        setVideoHD(() => null);
        setVideoUHD(() => null);
        setVideoFHD(() => null);
        cancelDeleteFun();
        await queryClient.invalidateQueries({ queryKey: ["film", params?.id] });
      },
      onError: (error) => {
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

  

  if (isLoading) {
    return (
      <>
        <CustomLoader />
      </>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-14 max-w-[1000px] relative">
      {/** Trailer */}
      {videoTrailer ? (
        <div className="flex flex-col  gap-6">
          <div className="flex flex-row  gap-8 items-center max-w-[80%]">
            <div className="flex flex-col gap-[7px] min-w-[150px] ">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                Trailer
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-[20px]">
              <div className="bg-[#36323E] w-[470px] h-[266px]  flex ">
                {console.log("🎬 Rendering trailer player with:", { url: videoTrailer?.url, hlsUrl: videoTrailer?.hlsUrl })}
                <ServerStreamingPlayer
                  resourceId={film?.id}
                  videoUrl={videoTrailer?.url}
                  hlsUrl={videoTrailer?.hlsUrl}
                  type="hd" // Trailers are always HD
                  isTrailer={true} // Explicitly mark this as a trailer
                  controls={false}
                  width="100%"
                  height="100%"
                  aspectRatio="16/9"
                />
              </div>

              <div className="flex flex-row gap-10 mt-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                    Duration
                  </h1>
                  <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    {videoTrailer?.duration}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                    Size
                  </h1>
                  <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    {videoTrailer?.size}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                    Format
                  </h1>
                  <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    HLS Streaming
                  </p>
                </div>
              </div>

              {/** delete video */}
              <div className="flex flex-row gap-10">
                <Button
                  onClick={() => deleteFun(videoTrailer?.id)}
                  className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                >
                  Delete Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {type !== "episode" && (
            <>
              {/* Show trailer processing status if there's an existing trailer job */}
              {existingJob && existingJob.jobType === 'trailer_processing' && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-8 max-w-[80%]">
                    <div className="flex flex-col gap-[7px] min-w-[150px]">
                      <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                        Trailer Processing
                      </h1>
                      <p className="font-[Inter-Regular] text-base text-[#706E72]">
                        Your trailer is currently being processed
                      </p>
                    </div>
                    <Button
                      onClick={checkExistingJob}
                      disabled={checkingJob}
                      className="w-max min-w-[100px]"
                    >
                      {checkingJob ? 'Checking...' : 'Refresh'}
                    </Button>
                  </div>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Trailer Processing Job:</strong> {existingJob.fileName}
                      <br />
                      <strong>Status:</strong> {existingJob.status} | <strong>Progress:</strong> {existingJob.progress}%
                      <br />
                      <strong>Job Type:</strong> {existingJob.jobType || 'Trailer Processing'}
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
                  
                  <VideoProcessingStatus clientId={film?.id} />
                </div>
              )}
              
              {/* Show trailer upload component only if no existing trailer job */}
              {(!existingJob || existingJob.jobType !== 'trailer_processing') && (
                <TrailerUploadVideo
                  videoType={"Trailer"}
                  film={film}
                  type={type}
                  setErrorUpload={setErrorUpload}
                  setSucessUpload={setSucessUpload}
                  errorUpload={errorUpload}
                  sucessUpload={sucessUpload}
                />
              )}
            </>
          )}
        </>
      )}

      {/** Multiple Upload Video */}

      {film?.type !== "series" && type !== "season" && (
        <>
          {/* Show processing status if there's an existing job */}
          {existingJob && existingJob.jobType !== 'trailer_processing' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-8 max-w-[80%]">
                <div className="flex flex-col gap-[7px] min-w-[150px]">
                  <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                    Video Processing
                  </h1>
                  <p className="font-[Inter-Regular] text-base text-[#706E72]">
                    A video is currently being processed for this resource
                  </p>
                </div>
                <Button
                  onClick={checkExistingJob}
                  disabled={checkingJob}
                  className="w-max min-w-[100px]"
                >
                  {checkingJob ? 'Checking...' : 'Refresh'}
                </Button>
              </div>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Processing Job:</strong> {existingJob.fileName}
                  <br />
                  <strong>Status:</strong> {existingJob.status} | <strong>Progress:</strong> {existingJob.progress}%
                  <br />
                  <strong>Created:</strong> {new Date(existingJob.createdAt).toLocaleString()}
                </Typography>
              </Alert>
              
              <VideoProcessingStatus clientId={film?.id} />
            </div>
          )}
          
          {/* Show upload components only if no existing regular video processing job */}
          {(!existingJob || existingJob.jobType === 'trailer_processing') && (
            <>
              {!videoSD && !videoHD && !videoUHD && !videoFHD ? (
                <>
                  <MultipleUploadVideo
                    videoType={"all"}
                    film={film}
                    type={type}
                    setErrorUpload={setErrorUpload}
                    setSucessUpload={setSucessUpload}
                    errorUpload={errorUpload}
                    sucessUpload={sucessUpload}
                  />
                </>
              ) : (
                <>
                  <div className=" flex flex-col gap-10 items-start w-full">
                    <Button
                      onClick={() =>
                        deleteAllVideos([
                          videoSD?.id,
                          videoHD?.id,
                          videoUHD?.id,
                          videoFHD?.id,
                        ])
                      }
                    >
                      Delete Videos
                    </Button>

                    {!videoSD || !videoHD || !videoUHD || !videoFHD ? (
                      <>
                   
                      <div className="flex flex-col gap-4 items-start w-full">
                        <div>
                          <Typography className="text-base capitalize text-[#EF4444]  font-[Inter-SemiBold]">
                            Missing Some Versions Please re-upload Videos
                          </Typography>
                        </div>
                        
                        <MultipleUploadVideo
                          videoType={"all"}
                          film={film}
                          type={type}
                          setErrorUpload={setErrorUpload}
                          setSucessUpload={setSucessUpload}
                          errorUpload={errorUpload}
                          sucessUpload={sucessUpload}
                        />
                      </div>
                      </>
                     
                    ) : null}
                  </div>
                  {/** SD */}
                  {film?.type !== "series" && type !== "series" && (
                    <>
                      {videoSD && (
                        <div className="flex flex-col  gap-6">
                          <div className="flex items-center gap-8 max-w-[80%]">
                            <div className="flex flex-col gap-[7px] min-w-[150px]">
                              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                SD (480P)
                              </h1>
                            </div>
                          </div>

                          <div className="flex flex-col gap-5">
                            {/** price */}
                            {/** FILM */}
                            <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                              {console.log("🎬 Rendering SD player with:", { url: videoSD?.url, hlsUrl: videoSD?.hlsUrl })}
                              <ServerStreamingPlayer
                                resourceId={film?.id}
                                videoUrl={videoSD?.url}
                                hlsUrl={videoSD?.hlsUrl}
                                type="sd"
                                controls={false}
                                width="100%"
                                height="100%"
                                aspectRatio="16/9"
                              />
                            </div>

                            <div className="flex flex-row gap-10 mt-4">
                              <div className="flex flex-col gap-1">
                                <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                                  Format
                                </h1>
                                <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                  HLS Streaming
                                </p>
                              </div>
                            </div>
                            {/** delete video */}
                            {/* <div className="flex flex-row gap-10 mt-10">
                              <Button
                                onClick={() => deleteFun(videoSD?.id)}
                                className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                              >
                                Delete Video
                              </Button>
                            </div> */}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/** hd */}
                  {film?.type !== "series" && type !== "series" && (
                    <>
                      {videoHD && (
                        <div className="flex flex-col  gap-6">
                          <div className="flex items-center gap-8 max-w-[80%]">
                            <div className="flex flex-col gap-[7px] min-w-[150px]">
                              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                HD (720P)
                              </h1>
                            </div>
                          </div>

                          <div className="flex flex-col gap-5">
                            {/** price */}

                            {/** FILM */}
                            <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                              <ServerStreamingPlayer
                                resourceId={film?.id}
                                videoUrl={videoHD?.url}
                                hlsUrl={videoHD?.hlsUrl}
                                type="hd"
                                controls={false}
                                width="100%"
                                height="100%"
                                aspectRatio="16/9"
                              />
                            </div>

                            <div className="flex flex-row gap-10 mt-4">
                              <div className="flex flex-col gap-1">
                                <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                                  Format
                                </h1>
                                <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                  HLS Streaming
                                </p>
                              </div>
                            </div>

                            {/** delete video */}
                            {/* <div className="flex flex-row gap-10 mt-10">
                              <Button
                                onClick={() => deleteFun(videoHD?.id)}
                                className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                              >
                                Delete Video
                              </Button>
                            </div> */}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/** fullhd */}
                  {film?.type !== "series" && type !== "series" && (
                    <>
                      {videoFHD && (
                        <div className="flex flex-col  gap-6">
                          <div className="flex items-center gap-8 max-w-[80%]">
                            <div className="flex flex-col gap-[7px] min-w-[150px]">
                              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                Full HD (1080P)
                              </h1>
                            </div>
                          </div>

                          <div className="flex flex-col gap-5">
                            {/** FILM */}
                            <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                              <ServerStreamingPlayer
                                resourceId={film?.id}
                                videoUrl={videoFHD?.url}
                                hlsUrl={videoFHD?.hlsUrl}
                                type="fhd"
                                controls={false}
                                width="100%"
                                height="100%"
                                aspectRatio="16/9"
                              />
                            </div>

                            <div className="flex flex-row gap-10 mt-4">
                              <div className="flex flex-col gap-1">
                                <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                                  Format
                                </h1>
                                <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                  HLS Streaming
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/** ultrahd */}
                  {film?.type !== "series" && type !== "series" && (
                    <>
                      {videoUHD && (
                        <div className="flex flex-col  gap-6">
                          <div className="flex items-center gap-8 max-w-[80%]">
                            <div className="flex flex-col gap-[7px] min-w-[150px]">
                              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                Ultra HD (2160p)
                              </h1>
                            </div>
                          </div>

                          <div className="flex flex-col gap-5">
                            {/** price */}

                            {/** FILM */}
                            <div className="bg-[#36323E] w-[500px] h-[266px] flex ">
                              <ServerStreamingPlayer
                                resourceId={film?.id}
                                videoUrl={videoUHD?.url}
                                hlsUrl={videoUHD?.hlsUrl}
                                type="uhd"
                                controls={false}
                                width="100%"
                                height="100%"
                                aspectRatio="16/9"
                              />
                            </div>

                            <div className="flex flex-row gap-10 mt-4">
                              <div className="flex flex-col gap-1">
                                <h1 className="font-[Inter-Regular] text-base text-[#706E72]">
                                  Format
                                </h1>
                                <p className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                                  HLS Streaming
                                </p>
                              </div>
                            </div>

                            {/** delete video */}
                            {/* <div className="flex flex-row gap-10 mt-10">
                              <Button
                                onClick={() => deleteFun(videoUHD?.id)}
                                className="bg-transparent border border-primary-500 rounded-full px-4 text-primary-500 font-[Inter-Regular] text-opacity-50 border-opacity-50 hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                              >
                                Delete Video
                              </Button>
                            </div> */}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/** Subtitle Management Section */}
      {((videoSD || videoHD || videoFHD || videoUHD) && !existingJob) && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8 max-w-[80%]">
            <div className="flex flex-col gap-[7px] min-w-[150px]">
              <h1 className="font-[Inter-SemiBold] text-base sm:text-lg text-whites-40">
                Subtitles
              </h1>
              <p className="font-[Inter-Regular] text-base text-[#706E72]">
                Manage subtitle files for this content
              </p>
            </div>
          </div>

          {/* Upload New Subtitle */}
          <div className="flex flex-col gap-4 p-6 bg-[#36323E] rounded-lg">
            <h2 className="font-[Inter-SemiBold] text-base text-whites-40">
              Upload New Subtitle
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  id="subtitle-file-input"
                  type="file"
                  accept=".vtt"
                  onChange={handleSubtitleFileChange}
                  className="block w-full text-sm text-whites-40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-whites-40 hover:file:bg-primary-700"
                />
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="px-3 py-2 bg-[#2A2630] border border-[#706E72] rounded-lg text-whites-40 text-sm focus:outline-none focus:border-primary-500 min-w-[150px]"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                  <option value="custom">Custom Language</option>
                </select>
                {showCustomLanguageInput && (
                  <input
                    type="text"
                    placeholder="Enter custom language code (e.g., spa, fra, deu)"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    className="px-3 py-2 bg-[#2A2630] border border-[#706E72] rounded-lg text-whites-40 text-sm focus:outline-none focus:border-primary-500"
                  />
                )}
                <input
                  type="text"
                  placeholder="Subtitle label (e.g., English, Spanish, English CC)"
                  value={subtitleLabel}
                  onChange={(e) => setSubtitleLabel(e.target.value)}
                  className="px-3 py-2 bg-[#2A2630] border border-[#706E72] rounded-lg text-whites-40 text-sm focus:outline-none focus:border-primary-500 min-w-[200px]"
                />
                <Button
                  onClick={uploadSubtitle}
                  disabled={!subtitleFile || uploadingSubtitle || (selectedLanguage === 'custom' && !customLanguage.trim())}
                  className="min-w-[120px]"
                >
                  {uploadingSubtitle ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              {subtitleFile && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-[#706E72]">
                    Selected file: {subtitleFile.name}
                  </p>
                  <p className="text-sm text-[#706E72]">
                    Language: {getLanguageName(getFinalLanguageCode())}
                  </p>
                  {subtitleLabel && (
                    <p className="text-sm text-[#706E72]">
                      Label: {subtitleLabel}
                    </p>
                  )}
                  {showCustomLanguageInput && !customLanguage.trim() && (
                    <p className="text-sm text-red-400">
                      Please enter a custom language code
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Existing Subtitles */}
          <div className="flex flex-col gap-4 p-6 bg-[#36323E] rounded-lg">
            <h2 className="font-[Inter-SemiBold] text-base text-whites-40">
              Existing Subtitles
            </h2>
            
            {loadingSubtitles ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-2 text-whites-40">Loading subtitles...</span>
              </div>
            ) : existingSubtitles.length > 0 ? (
              <div className="grid gap-4">
                {existingSubtitles.map((subtitle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#2A2630] rounded-lg">
                    <div className="flex flex-col gap-1 flex-1">
                      <h3 className="font-[Inter-SemiBold] text-sm text-whites-40">
                        {getLanguageName(subtitle.language) || 'Unknown Language'}
                      </h3>
                      {editingSubtitleId === subtitle.id ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={editingLabel}
                            onChange={(e) => setEditingLabel(e.target.value)}
                            className="px-2 py-1 bg-[#36323E] border border-[#706E72] rounded text-whites-40 text-sm focus:outline-none focus:border-primary-500 flex-1"
                            placeholder="Enter subtitle label"
                          />
                          <Button
                            onClick={() => saveEditSubtitle(subtitle.id)}
                            className="bg-primary-500 hover:bg-primary-700 text-whites-40 px-2 py-1 rounded text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={cancelEditSubtitle}
                            className="bg-transparent border border-[#706E72] text-[#706E72] px-2 py-1 rounded text-xs hover:border-whites-40 hover:text-whites-40"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-[#706E72]">
                            <strong>Label:</strong> {subtitle.label || 'No label set'}
                          </p>
                          <p className="text-xs text-[#706E72]">
                            <strong>File:</strong> {subtitle.filename || 'Subtitle file'}
                          </p>
                          <p className="text-xs text-[#706E72]">
                            <strong>Language code:</strong> {subtitle.language || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingSubtitleId !== subtitle.id && (
                        <Button
                          onClick={() => startEditSubtitle(subtitle)}
                          className="bg-transparent border border-primary-500 rounded-full px-3 py-1 text-primary-500 font-[Inter-Regular] text-sm hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteSubtitle(subtitle.id)}
                        className="bg-transparent border border-red-500 rounded-full px-3 py-1 text-red-500 font-[Inter-Regular] text-sm hover:text-opacity-100 hover:border-opacity-100 hover:bg-transparent"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-[#706E72] text-center">
                  No subtitles uploaded yet. Upload a .vtt file to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/** error & sucess message */}

      {/** Modal for deleting Trailer */}
      {videoDeleteId && (
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
                  {deleteVideoMutation.isPending ? (
                    <Button className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]">
                      Deleting...
                    </Button>
                  ) : (
                    <>
                      {" "}
                      <Button
                        className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                        onClick={() => confirmDeleteFun(videoDeleteId)}
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

      {/** Modal for deleting All Videos */}
      {videoIds?.videoIds?.length > 0 && (
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
                  Are you sure you want to delete all videos?
                </div>
                <div className="flex flex-col items-center bg-whites-500 text-white gap-5">
                  {deleteAllVideosMutation.isPending ? (
                    <Button className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]">
                      Deleting...
                    </Button>
                  ) : (
                    <>
                      {" "}
                      <Button
                        className="bg-primary-500 hover:bg-primary-700 w-full text-whites-40 text-opacity-80 font-bold py-2 px-4 rounded min-w-[150px] font-[Inter-SemiBold]"
                        onClick={() => confirmDeleteAllFun(videoIds)}
                      >
                        Yes
                      </Button>
                      <Button
                        className="bg-secondary-500 hover:bg-secondary-700 text-whites-40 font-bold font-[Inter-SemiBold] py-2 px-4 rounded min-w-[150px]"
                        onClick={cancelAllDeleteFun}
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
    </div>
  );
};

export default ViewTrailerFilm;
