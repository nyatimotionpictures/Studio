import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh,
  Cancel,
  Delete,
  Clear,
  PlayArrow,
  Stop,
  CheckCircle,
  Error,
  Schedule,
  ExpandMore,
  Visibility,
  StopCircle,
} from '@mui/icons-material';
import Sidebar from '../../../../2-Components/Navigation/Sidebar.tsx';
import CustomStack from '../../../../2-Components/Stacks/CustomStack.jsx';
import apiRequest from '../../../../3-Middleware/apiRequest.js';
import socket from '../../../../lib/socket.js';

const VideoJobsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [uploadJobs, setUploadJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  });
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('transcoding'); // 'transcoding' or 'upload'
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    jobId: null,
    title: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [expandedJob, setExpandedJob] = useState(null);
  const [expandedUploadJob, setExpandedUploadJob] = useState(null);

  // Real-time progress tracking
  const [jobProgress, setJobProgress] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (jobTypeFilter === 'transcoding') {
      fetchJobs();
    } else {
      fetchUploadJobs();
    }
    setupSocketListeners();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (jobTypeFilter === 'transcoding') {
        fetchJobs();
      } else {
        fetchUploadJobs();
      }
    }, 30000);
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [statusFilter, typeFilter, jobTypeFilter]);

  const setupSocketListeners = () => {
    if (!socket) {
      console.error('Socket not available');
      return;
    }

    try {
      socket.connect();
      setSocketConnected(true);
      console.log('Socket connected, setting up listeners...');

      // Add connection event listeners
      socket.on('connect', () => {
        console.log('Socket connected successfully');
        setSocketConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setSocketConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setSocketConnected(false);
      });

      // Listen for splitting progress
      socket.on("SplittingProgress", ({ progress, stage, clientId }) => {
        console.log('SplittingProgress received:', { progress, stage, clientId });
        setJobProgress(prev => ({
          ...prev,
          [clientId]: {
            ...prev[clientId],
            splitting: { stage, progress }
          }
        }));
      });

      // Listen for transcoding progress
      socket.on("transcodingProgress", ({ resolution, progress, stage, segmentLength, clientId }) => {
        console.log('transcodingProgress received:', { resolution, progress, stage, segmentLength, clientId });
        setJobProgress(prev => ({
          ...prev,
          [clientId]: {
            ...prev[clientId],
            transcoding: {
              ...prev[clientId]?.transcoding,
              [resolution]: { progress, segmentLength }
            }
          }
        }));
      });

      // Listen for merge progress
      socket.on("MergeProgress", ({ resolution, progress, stage, clientId }) => {
        console.log('MergeProgress received:', { resolution, progress, stage, clientId });
        setJobProgress(prev => ({
          ...prev,
          [clientId]: {
            ...prev[clientId],
            merging: {
              ...prev[clientId]?.merging,
              [resolution]: { stage, progress }
            }
          }
        }));
      });

      // Listen for upload progress
      socket.on("uploadProgress", ({ content, progress, clientId }) => {
        console.log('uploadProgress received:', { content, progress, clientId });

        // Update transcoding job progress
        setJobProgress(prev => ({
          ...prev,
          [clientId]: {
            ...prev[clientId],
            uploading: {
              ...prev[clientId]?.uploading,
              [content?.resolution]: progress
            }
          }
        }));

        // Update upload job progress
        setUploadProgress(prev => ({
          ...prev,
          [clientId]: {
            ...prev[clientId],
            progress: progress,
            content: content
          }
        }));
      });

      // Listen for job completion
      socket.on("JobCompleted", ({ clientId }) => {
        console.log('JobCompleted received:', { clientId });
        setJobProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[clientId];
          return newProgress;
        });
        fetchJobs(); // Refresh jobs list
      });

      // Listen for job failure
      socket.on("JobFailed", ({ clientId, message }) => {
        console.log('JobFailed received:', { clientId, message });
        setJobProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[clientId];
          return newProgress;
        });
        showSnackbar(`Job failed: ${message}`, 'error');
        fetchJobs(); // Refresh jobs list
      });

      // Listen for job cancellation
      socket.on("JobCancelled", ({ clientId, message }) => {
        console.log('JobCancelled received:', { clientId, message });
        setJobProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[clientId];
          return newProgress;
        });
        showSnackbar(`Job cancelled: ${message}`, 'warning');
        fetchJobs(); // Refresh jobs list
      });
    } catch (error) {
      console.error('Error setting up socket listeners:', error);
      setSocketConnected(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const response = await apiRequest.get(`/v1/studio/processing-jobs?${params}`);
      setJobs(response.data.jobs);
      setStats(response.data.stats);

      // Join socket rooms for active jobs
      if (socket && socketConnected) {
        const activeJobs = response.data.jobs.filter(job => job.status === 'active');
        console.log('Active jobs found:', activeJobs.length);

        activeJobs.forEach(job => {
          const clientId = job.resourceId; // Use resourceId as clientId
          console.log('Joining socket room for job:', { jobId: job.id, clientId, resourceId: job.resourceId });
          socket.emit("joinRoom", clientId);
        });
      } else {
        console.log('Socket not available or not connected:', { socket: !!socket, socketConnected });
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showSnackbar('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadJobs = async () => {
    try {
      setUploadLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const response = await apiRequest.get(`/v1/studio/upload-jobs?${params}`);
      setUploadJobs(response.data.jobs);
      setUploadStats(response.data.stats);

      // Join socket rooms for active upload jobs
      if (socket && socketConnected) {
        const activeUploadJobs = response.data.jobs.filter(job => job.status === 'active');
        console.log('Active upload jobs found:', activeUploadJobs.length);

        activeUploadJobs.forEach(job => {
          const clientId = job.resourceId;
          console.log('Joining socket room for upload job:', { jobId: job.id, clientId, resourceId: job.resourceId });
          socket.emit("joinRoom", clientId);
        });
      }
    } catch (error) {
      console.error('Error fetching upload jobs:', error);
      showSnackbar('Failed to load upload jobs', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openConfirmDialog = (action, jobId, title, message) => {
    setConfirmDialog({
      open: true,
      action,
      jobId,
      title,
      message,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      action: null,
      jobId: null,
      title: '',
      message: '',
    });
  };

  const executeAction = async () => {
    const { action, jobId } = confirmDialog;

    try {
      let response;

      switch (action) {
        case 'cancel':
        case 'stop':
          response = await apiRequest.post(`/v1/studio/processing-jobs/${jobId}/cancel`);
          break;

        case 'retry':
          if (jobTypeFilter === 'transcoding') {
            response = await apiRequest.post(`/v1/studio/processing-jobs/${jobId}/retry`);
          } else {
            response = await apiRequest.post(`/v1/studio/upload-jobs/${jobId}/retry`);
          }
          break;

        case 'cleanup':
          if (jobTypeFilter === 'transcoding') {
            response = await apiRequest.post(`/v1/studio/processing-jobs/${jobId}/cleanup`);
          } else {
            response = await apiRequest.post(`/v1/studio/upload-jobs/${jobId}/cleanup`);
          }
          break;

        case 'delete':
          if (jobTypeFilter === 'transcoding') {
            response = await apiRequest.delete(`/v1/studio/processing-jobs/${jobId}`);
          } else {
            response = await apiRequest.delete(`/v1/studio/upload-jobs/${jobId}`);
          }
          break;

        case 'clearCompleted':
          if (jobTypeFilter === 'transcoding') {
            response = await apiRequest.post('/v1/studio/processing-jobs/clear', { status: 'completed' });
          } else {
            response = await apiRequest.post('/v1/studio/upload-jobs/clear', { status: 'completed' });
          }
          break;

        case 'clearFailed':
          if (jobTypeFilter === 'transcoding') {
            response = await apiRequest.post('/v1/studio/processing-jobs/clear', { status: 'failed' });
          } else {
            response = await apiRequest.post('/v1/studio/upload-jobs/clear', { status: 'failed' });
          }
          break;

        case 'clearAll':
          if (jobTypeFilter === 'transcoding') {
            response = await apiRequest.post('/v1/studio/processing-jobs/clear', { status: 'all' });
          } else {
            response = await apiRequest.post('/v1/studio/upload-jobs/clear', { status: 'all' });
          }
          break;
      }

      showSnackbar(response.data.message, 'success');
      if (jobTypeFilter === 'transcoding') {
        fetchJobs();
      } else {
        fetchUploadJobs();
      }

    } catch (error) {
      console.error(`Error ${action} job:`, error);
      showSnackbar(error.response?.data?.message || `Failed to ${action} job`, 'error');
    }

    closeConfirmDialog();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting':
        return <Schedule />;
      case 'active':
        return <PlayArrow />;
      case 'completed':
        return <CheckCircle />;
      case 'failed':
        return <Error />;
      case 'cancelled':
        return <Stop />;
      default:
        return <Schedule />;
    }
  };

  // Make cancelled status lighter by using a custom color and style
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'active':
        return 'info';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        // Use "default" for color, but we will override the style for lighter look
        return 'default';
      case 'retried':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getResourceDisplayName = (job) => {
    const resource = job.film || job.episode;
    if (!resource) return job.resourceName;

    if (job.type === 'episode' && job.episode) {
      return `${job.episode.season.film.title} - S${job.episode.season.season}E${job.episode.episode}: ${resource.title}`;
    }

    return resource.title;
  };

  const renderDetailedProgress = (job) => {
    const clientId = job.resourceId;
    const progress = jobProgress[clientId];

    if (!progress) {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {job.status === 'active'
              ? 'Real-time progress data not available. The job may be processing but progress updates are not being received.'
              : 'No detailed progress available for this job status.'
            }
          </Typography>
          {job.status === 'active' && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Try refreshing the page or check your socket connection.
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {/* Splitting Progress */}
        {progress.splitting && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              File Splitting Progress:
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress.splitting.progress}
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption">
              {progress.splitting.stage}: {progress.splitting.progress}%
            </Typography>
          </Box>
        )}

        {/* Transcoding Progress */}
        {progress.transcoding && Object.keys(progress.transcoding).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Conversion Progress:
            </Typography>
            {Object.entries(progress.transcoding).map(([resolution, data]) => (
              <Box key={resolution} sx={{ mb: 1 }}>
                <Typography variant="caption">
                  {resolution.toUpperCase()} - {data.segmentLength}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.progress}
                  sx={{ mb: 0.5 }}
                />
                <Typography variant="caption">
                  {data.progress}%
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Merging Progress */}
        {progress.merging && Object.keys(progress.merging).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Combining Segments:
            </Typography>
            {Object.entries(progress.merging).map(([resolution, data]) => (
              <Typography key={resolution} variant="caption" display="block">
                {resolution.toUpperCase()} - {data.stage}
              </Typography>
            ))}
          </Box>
        )}

        {/* Upload Progress */}
        {progress.uploading && Object.keys(progress.uploading).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Upload Progress:
            </Typography>
            {Object.entries(progress.uploading).map(([resolution, uploadProgress]) => (
              <Box key={resolution} sx={{ mb: 1 }}>
                <Typography variant="caption">
                  {resolution.toUpperCase()}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ mb: 0.5 }}
                />
                <Typography variant="caption">
                  {uploadProgress}%
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Show message if no progress data is available */}
        {(!progress.splitting && !progress.transcoding && !progress.merging && !progress.uploading) && (
          <Typography variant="body2" color="text.secondary">
            No detailed progress data available yet. Progress updates will appear here once processing begins.
          </Typography>
        )}
      </Box>
    );
  };

  const renderUploadProgress = (job) => {
    const clientId = job.resourceId;
    const progress = uploadProgress[clientId];

    if (!progress) {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {job.status === 'active'
              ? 'Real-time upload progress data not available. The upload may be processing but progress updates are not being received.'
              : 'No detailed upload progress available for this job status.'
            }
          </Typography>
          {job.status === 'active' && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Try refreshing the page or check your socket connection.
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {/* Upload Progress */}
        {progress.content && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Upload Progress:
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress.progress || 0}
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption">
              {progress.progress || 0}%
            </Typography>

            {/* Upload Content Details */}
            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
              <Typography variant="caption" display="block" sx={{ color: 'whites.200' }}>
                <strong>Content Type:</strong> {progress.content.type || 'Unknown'}
              </Typography>
              {progress.content.resolution && (
                <Typography variant="caption" display="block" sx={{ color: 'whites.200' }}>
                  <strong>Resolution:</strong> {progress.content.resolution}
                </Typography>
              )}
              {progress.content.fileType && (
                <Typography variant="caption" display="block" sx={{ color: 'whites.200' }}>
                  <strong>File Type:</strong> {progress.content.fileType}
                </Typography>
              )}
              {progress.content.subtitle && (
                <Typography variant="caption" display="block" sx={{ color: 'whites.200' }}>
                  <strong>Subtitle:</strong> {progress.content.subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Show message if no progress data is available */}
        {!progress.content && (
          <Typography variant="body2" color="text.secondary">
            No detailed upload progress data available yet. Progress updates will appear here once uploading begins.
          </Typography>
        )}
      </Box>
    );
  };

  const StatCard = ({ title, value, icon }) => (
    <Card sx={{
      bgcolor: 'secondary.800',
      color: 'whites.40',
      '& .MuiCardContent-root': {
        bgcolor: 'secondary.800',
        color: 'whites.40'
      }
    }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: 'whites.40' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'whites.200' }}>
            {title}
          </Typography>
        </Box>
        {icon}
      </CardContent>
    </Card>
  );

  return (
    <CustomStack>
      <Sidebar />
      <Box sx={{
        flex: 1,
        p: 3,
        bgcolor: 'secondary.800',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        overflowY: 'auto'
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif' }}>
          Video Processing Jobs
        </Typography>
        <Typography variant="body1" sx={{ color: 'whites.200', fontFamily: 'Inter, sans-serif' }} gutterBottom>
          Monitor and manage your video transcoding jobs
        </Typography>

        {!socketConnected && (
          <Alert severity="warning" sx={{ mb: 2, bgcolor: 'warning.dark', color: 'warning.contrastText' }}>
            Real-time updates unavailable - Socket disconnected
          </Alert>
        )}

        {/* Debug section - remove this after testing */}
        {process.env.NODE_ENV === 'development' && (
          <Alert severity="info" sx={{ mb: 2, bgcolor: 'info.dark', color: 'info.contrastText' }}>
            <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
              Debug Info: Socket Connected: {socketConnected ? 'Yes' : 'No'} |
              Progress Data Keys: {Object.keys(jobProgress).join(', ') || 'None'} |
              Active Jobs: {jobs.filter(j => j.status === 'active').length}
            </Typography>
          </Alert>
        )}

        {/* Job Type Toggle */}
        <Card sx={{ mb: 3, bgcolor: 'secondary.700' }}>
          <CardContent sx={{ bgcolor: 'secondary.700' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif' }}>
                Job Type:
              </Typography>
              <Button
                variant={jobTypeFilter === 'transcoding' ? 'contained' : 'outlined'}
                onClick={() => setJobTypeFilter('transcoding')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Transcoding Jobs
              </Button>
              <Button
                variant={jobTypeFilter === 'upload' ? 'contained' : 'outlined'}
                onClick={() => setJobTypeFilter('upload')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Upload Jobs
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title={jobTypeFilter === 'transcoding' ? "Total Transcoding Jobs" : "Total Upload Jobs"}
              value={jobTypeFilter === 'transcoding' ? stats.total : uploadStats.total}
              icon={<Schedule color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Waiting"
              value={jobTypeFilter === 'transcoding' ? stats.waiting : uploadStats.waiting}
              icon={<Schedule color="warning" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Active"
              value={jobTypeFilter === 'transcoding' ? stats.active : uploadStats.active}
              icon={<PlayArrow color="info" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Completed"
              value={jobTypeFilter === 'transcoding' ? stats.completed : uploadStats.completed}
              icon={<CheckCircle color="success" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Failed"
              value={jobTypeFilter === 'transcoding' ? stats.failed : uploadStats.failed}
              icon={<Error color="error" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Cancelled"
              value={jobTypeFilter === 'transcoding' ? stats.cancelled : uploadStats.cancelled}
              icon={<Stop sx={{ color: '#e0e0e0' }} />}
            />
          </Grid>
        </Grid>

        {/* Controls */}
        <Card sx={{ mb: 3, bgcolor: 'secondary.700' }}>
          <CardContent sx={{ bgcolor: 'secondary.700' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchJobs}
                disabled={loading}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Refresh
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  if (socket) {
                    socket.disconnect();
                    setTimeout(() => {
                      setupSocketListeners();
                      fetchJobs();
                    }, 1000);
                  }
                }}
                disabled={loading}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Refresh Socket
              </Button>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'whites.200', fontFamily: 'Inter, sans-serif' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                  sx={{
                    color: 'whites.40',
                    fontFamily: 'Inter, sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'whites.200'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'whites.100'
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>All Status</MenuItem>
                  <MenuItem value="waiting" sx={{ fontFamily: 'Inter, sans-serif' }}>Waiting</MenuItem>
                  <MenuItem value="active" sx={{ fontFamily: 'Inter, sans-serif' }}>Active</MenuItem>
                  <MenuItem value="completed" sx={{ fontFamily: 'Inter, sans-serif' }}>Completed</MenuItem>
                  <MenuItem value="failed" sx={{ fontFamily: 'Inter, sans-serif' }}>Failed</MenuItem>
                  <MenuItem value="cancelled" sx={{ fontFamily: 'Inter, sans-serif' }}>Cancelled</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'whites.200', fontFamily: 'Inter, sans-serif' }}>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                  sx={{
                    color: 'whites.40',
                    fontFamily: 'Inter, sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'whites.200'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'whites.100'
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontFamily: 'Inter, sans-serif' }}>All Types</MenuItem>
                  <MenuItem value="film" sx={{ fontFamily: 'Inter, sans-serif' }}>Films</MenuItem>
                  <MenuItem value="episode" sx={{ fontFamily: 'Inter, sans-serif' }}>Episodes</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                color="warning"
                startIcon={<Clear />}
                onClick={() => openConfirmDialog('clearCompleted', null, 'Clear Completed Jobs', 'Are you sure you want to clear all completed job records?')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Clear Completed
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Clear />}
                onClick={() => openConfirmDialog('clearFailed', null, 'Clear Failed Jobs', 'Are you sure you want to clear all failed job records?')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Clear Failed
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Clear />}
                onClick={() => openConfirmDialog('clearAll', null, 'Clear All Finished Jobs', 'Are you sure you want to clear all finished job records (completed, failed, cancelled)?')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
              >
                Clear All Finished
              </Button>

              {jobTypeFilter === 'transcoding' && (
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<Refresh />}
                  onClick={async () => {
                    try {
                      const response = await apiRequest.post('/v1/studio/processing-jobs/fix-stuck');
                      showSnackbar(response.data.message, 'success');
                      fetchJobs();
                    } catch (error) {
                      console.error('Error fixing stuck jobs:', error);
                      showSnackbar(error.response?.data?.message || 'Failed to fix stuck jobs', 'error');
                    }
                  }}
                  disabled={loading}
                  sx={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Fix Stuck Jobs
                </Button>
              )}

              {jobTypeFilter === 'upload' && (
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<Refresh />}
                  onClick={async () => {
                    try {
                      const response = await apiRequest.post('/v1/studio/upload-jobs/fix-stuck');
                      showSnackbar(response.data.message, 'success');
                      fetchUploadJobs();
                    } catch (error) {
                      console.error('Error fixing stuck upload jobs:', error);
                      showSnackbar(error.response?.data?.message || 'Failed to fix stuck upload jobs', 'error');
                    }
                  }}
                  disabled={uploadLoading}
                  sx={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Fix Stuck Upload Jobs
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card sx={{ bgcolor: 'secondary.700' }}>
          <TableContainer >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: 'secondary.600' }}>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {jobTypeFilter === 'transcoding' ? 'Resource' : 'Upload Type'}
                  </TableCell>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {jobTypeFilter === 'transcoding' ? 'Type' : 'Content Type'}
                  </TableCell>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>File Name</TableCell>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Progress</TableCell>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {((jobTypeFilter === 'transcoding' && loading) || (jobTypeFilter === 'upload' && uploadLoading)) ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ bgcolor: 'secondary.700' }}>
                      <LinearProgress />
                      <Typography variant="body2" sx={{ mt: 1, color: 'whites.200', fontFamily: 'Inter, sans-serif' }}>
                        Loading {jobTypeFilter === 'transcoding' ? 'transcoding' : 'upload'} jobs...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : ((jobTypeFilter === 'transcoding' && jobs.length === 0) || (jobTypeFilter === 'upload' && uploadJobs.length === 0)) ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ bgcolor: 'secondary.700' }}>
                      <Typography variant="body2" sx={{ color: 'whites.200', fontFamily: 'Inter, sans-serif' }}>
                        No {jobTypeFilter === 'transcoding' ? 'transcoding' : 'upload'} jobs found matching your filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  (jobTypeFilter === 'transcoding' ? jobs : uploadJobs).map((job) => (
                    <React.Fragment key={job.id}>
                      <TableRow sx={{ bgcolor: 'secondary.700' }}>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                            {jobTypeFilter === 'transcoding'
                              ? getResourceDisplayName(job)
                              : (job.uploadType || 'Unknown Upload')
                            }
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          {jobTypeFilter === 'transcoding' ? (
                            <Chip
                              label={job.type === 'film' ? 'Movie' : 'Episode'}
                              size="small"
                              variant="outlined"
                              sx={{ fontFamily: 'Inter, sans-serif', color: '#fff', borderColor: '#fff' }}
                            />
                          ) : (
                            <Chip
                              label={job.contentType || 'Unknown'}
                              size="small"
                              variant="outlined"
                              sx={{ fontFamily: 'Inter, sans-serif', color: '#fff', borderColor: '#fff' }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          <Typography variant="body2" fontFamily="monospace" sx={{ color: 'whites.200' }}>
                            {job.fileName || job.filename || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          <Chip
                            icon={getStatusIcon(job.status)}
                            label={job.status.toUpperCase()}
                            color={getStatusColor(job.status)}
                            size="small"
                            sx={{
                              fontFamily: 'Inter, sans-serif',
                              ...(job.status === 'cancelled'
                                ? {
                                  bgcolor: '#f5f5f5',
                                  color: '#888',
                                  border: '1px solid #e0e0e0',
                                  fontWeight: 500,
                                }
                                : {}),
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          <Box sx={{ width: '100px' }}>
                            <LinearProgress
                              variant="determinate"
                              value={job.progress || 0}
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" sx={{ color: 'whites.200', fontFamily: 'Inter, sans-serif' }}>
                              {job.progress || 0}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          <Typography variant="body2" sx={{ color: 'whites.200', fontFamily: 'Inter, sans-serif' }}>
                            {formatDate(job.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'secondary.700' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {/* Show detailed progress button for active jobs */}
                            {job.status === 'active' && (
                              <Tooltip title="View Detailed Progress">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => {
                                    if (jobTypeFilter === 'transcoding') {
                                      setExpandedJob(expandedJob === job.id ? null : job.id);
                                    } else {
                                      setExpandedUploadJob(expandedUploadJob === job.id ? null : job.id);
                                    }
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            )}

                            {job.status === 'active' && (
                              <Tooltip title="Stop Processing">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => openConfirmDialog('stop', job.id, 'Stop Processing', 'Are you sure you want to stop this job? This will cancel the current processing.')}
                                >
                                  <StopCircle />
                                </IconButton>
                              </Tooltip>
                            )}

                            {job.canCancel && job.status === 'waiting' && (
                              <Tooltip title="Cancel Job">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => openConfirmDialog('cancel', job.id, 'Cancel Job', 'Are you sure you want to cancel this job?')}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            )}

                            {job.status === 'failed' && (
                              <Tooltip title="Retry Job">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => openConfirmDialog('retry', job.id, 'Retry Job', 'Are you sure you want to retry this failed job?')}
                                >
                                  <Refresh />
                                </IconButton>
                              </Tooltip>
                            )}

                            {job.status === 'failed' && jobTypeFilter === 'transcoding' && (
                              <Tooltip title="Clean Up Folders">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => openConfirmDialog('cleanup', job.id, 'Clean Up Folders', 'Are you sure you want to clean up the folders for this failed job? This will remove any temporary files and allow for conflict-free re-upload.')}
                                >
                                  <Clear />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Sync button for stuck jobs */}
                            {job.status === 'waiting' && (
                              <Tooltip title="Sync Job Status">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={async () => {
                                    try {
                                      const endpoint = jobTypeFilter === 'transcoding'
                                        ? `/v1/studio/processing-jobs/${job.id}/sync`
                                        : `/v1/studio/upload-jobs/${job.id}/sync`;
                                      const response = await apiRequest.post(endpoint);
                                      showSnackbar(response.data.message, 'success');
                                      if (jobTypeFilter === 'transcoding') {
                                        fetchJobs();
                                      } else {
                                        fetchUploadJobs();
                                      }
                                    } catch (error) {
                                      console.error('Error syncing job:', error);
                                      showSnackbar(error.response?.data?.message || 'Failed to sync job status', 'error');
                                    }
                                  }}
                                >
                                  <Refresh />
                                </IconButton>
                              </Tooltip>
                            )}

                            {['completed', 'failed', 'cancelled', 'retried'].includes(job.status) && (
                              <Tooltip title="Delete Job Record">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => openConfirmDialog('delete', job.id, 'Delete Job Record', 'Are you sure you want to delete this job record?')}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Detailed Progress Row */}
                      {((jobTypeFilter === 'transcoding' && expandedJob === job.id) ||
                        (jobTypeFilter === 'upload' && expandedUploadJob === job.id)) && (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ p: 0, bgcolor: 'secondary.700' }}>
                              <Collapse in={true} timeout="auto" unmountOnExit>
                                <Box sx={{
                                  p: 2,
                                  bgcolor: 'secondary.600',
                                  borderTop: '1px solid',
                                  borderColor: 'secondary.500',
                                  maxHeight: '400px',
                                  
                                }}>
                                  <Typography variant="h6" gutterBottom sx={{ color: 'whites.40', fontFamily: 'Inter, sans-serif' }}>
                                    Detailed Progress - {jobTypeFilter === 'transcoding'
                                      ? getResourceDisplayName(job)
                                      : (job.uploadType || 'Upload Job')
                                    }
                                  </Typography>
                                  {jobTypeFilter === 'transcoding'
                                    ? renderDetailedProgress(job)
                                    : renderUploadProgress(job)
                                  }
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
          <DialogTitle sx={{ fontFamily: 'Inter, sans-serif' }}>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog} sx={{ fontFamily: 'Inter, sans-serif' }}>Cancel</Button>
            <Button onClick={executeAction} color="primary" variant="contained" sx={{ fontFamily: 'Inter, sans-serif' }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', fontFamily: 'Inter, sans-serif' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </CustomStack>
  );
};

export default VideoJobsManager; 