import 'react-tabs/style/react-tabs.css';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthProvider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { invoke } from '../../lib/axios';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

type Film = {
  id: string;
  title: string;
  overview: string;
  plotSummary: string;
  releaseDate: Date;
  type: string;
};

function EditFilm() {
  const [activeTab, setActiveTab] = useState(0);

  const [film, setFilm] = useState<Film | null>(null); // [1]
  const moveToNextTab = () => {
    setActiveTab((prev) => prev + 1);
  };

  const storeFilm = (film: Film) => {
    // We could save it to state
    setFilm(film);
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-700 p-4 rounded-md space-y-4">
      <div className="min-h-24 bg-slate-600 rounded w-full p-4">
        <small>{film?.id}</small>
        <h1 className="text-orange-50 text-lg font-bold capitalize">
          {film?.title}
        </h1>
        <p>{film?.overview}</p>
      </div>
      <div>
        <Tabs selectedIndex={activeTab} onSelect={(idx) => setActiveTab(idx)}>
          <TabList>
            <Tab>Film Details</Tab>
            <Tab>Upload Film</Tab>
          </TabList>

          <TabPanel>
            <FilmDetailsForm
              storeFilm={storeFilm}
              moveToNextTab={moveToNextTab}
            />
          </TabPanel>
          <TabPanel>{/* <UploadFilmForm film={film} /> */}</TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

type FormValues = {
  title: string;
  overview: string;
  plotSummary: string;
  releaseDate: Date;
  type: string;
};

function FilmDetailsForm({
  moveToNextTab,
  storeFilm,
}: {
  moveToNextTab: () => void;
  storeFilm: (film: Film) => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      overview: '',
      plotSummary: '',
      releaseDate: new Date(),
      type: 'movie',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const response = await invoke<{ film: Film }>({
      method: 'POST',
      endpoint: '/film/create',
      data: {
        ...data,
        createdBy: user?.id,
        adminId: user?.id,
      },
    });
    if (response?.error) {
      setLoading(false);
      throw new Error(response.error);
    }

    if (response?.res) {
      storeFilm(response.res?.film);
    }

    console.log('response', response);
    // clear form
    reset();
    // redirect to admin page
    setLoading(false);
    moveToNextTab();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter film title"
            {...register('title')}
            className="w-full p-2 border bg-slate-600 border-slate-500 rounded-md text-orange-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="overview" className="block">
            Overview
          </label>
          <textarea
            id="overview"
            placeholder="Enter film overview"
            {...register('overview')}
            className="w-full p-2 border bg-slate-600 border-slate-500 rounded-md text-orange-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="plotSummary" className="block">
            Plot Summary
          </label>
          <textarea
            id="plotSummary"
            placeholder="Enter film plot summary"
            {...register('plotSummary')}
            className="w-full p-2 border bg-slate-600 border-slate-500 rounded-md text-orange-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="releaseDate" className="block">
            Release Date
          </label>
          <input
            type="date"
            id="releaseDate"
            {...register('releaseDate')}
            className="w-full p-2 border bg-slate-600 border-slate-500 rounded-md text-orange-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="block">
            Type
          </label>
          <select
            id="type"
            {...register('type')}
            className="w-full p-2 border bg-slate-600 border-slate-500 rounded-md text-orange-50">
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-orange-50 p-2 rounded-md disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Film'}
          </button>
        </div>
      </div>
    </form>
  );
}

export function UploadFilmForm({
  film,
  moveToNextTab,
}: {
  film: Film | null;
  moveToNextTab: () => void;
}) {
  const { user } = useAuth();
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user?.id || !film?.id) return;
      setLoading(true);
      const formData = new FormData();
      formData.append('film', acceptedFiles[0]);
      formData.append('adminId', user?.id);
      const response = await invoke({
        method: 'POST',
        endpoint: `/film/upload/${film?.id}`,
        data: formData,
        options: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent?.total ?? 1),
            );
            setProgress(percentCompleted);
          },
        },
      });

      if (response?.error) {
        setLoading(false);
        throw new Error(response.error);
      }

      // navigate to admin page
      setLoading(false);
      moveToNextTab();
    },
    [user?.id, film?.id, moveToNextTab],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mkv', '.avi'] },
  });
  return (
    <div className="space-y-4">
      <p>Your Film title is: {film?.title}</p>
      <div>
        <div
          {...getRootProps()}
          className="border-dashed border-2 p-4 min-h-32 flex flex-col items-center justify-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
          {loading && <p>Uploading ...</p>}
          {progress > 0 && <p>Progress: {progress}%</p>}
        </div>
      </div>
    </div>
  );
}

export function UploadPosterForm({ film }: { film: Film | null }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user?.id || !film?.id) return;
      console.log('acceptedFiles', acceptedFiles);
      setLoading(true);
      const formData = new FormData();
      formData.append('film', acceptedFiles[0]);
      formData.append('adminId', user?.id);
      const response = await invoke({
        method: 'POST',
        endpoint: `/film/poster_upload/${film?.id}`,
        data: formData,
        options: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent?.total ?? 1),
            );
            setProgress(percentCompleted);
          },
        },
      });

      if (response?.error) {
        setLoading(false);
        throw new Error(response.error);
      }

      console.log('response', response);
      // navigate to admin page
      setLoading(false);
      navigate('/admin', { replace: true });
    },
    [user?.id, navigate, film?.id],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.png', '.jpeg'] },
  });
  return (
    <div className="space-y-4">
      <p>Your Film title is: {film?.title}</p>
      <div>
        <div
          {...getRootProps()}
          className="border-dashed border-2 p-4 min-h-32 flex flex-col items-center justify-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
          {loading && <p>Uploading ...</p>}
          {progress > 0 && <p>Progress: {progress}%</p>}
        </div>
      </div>
    </div>
  );
}

export default EditFilm;
