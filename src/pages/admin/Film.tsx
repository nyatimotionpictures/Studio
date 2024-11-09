import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { invoke } from '../../lib/axios';
import VideoStream from '../../components/VideoStream';

function Film() {
  const { film: filmId } = useParams();
  const { film, isLoading, fetchFilm } = useFilm();

  useEffect(() => {
    if (!filmId) return;
    fetchFilm(filmId);
  }, [fetchFilm, filmId]);

  if (isLoading) return <h1>Loading film...</h1>;

  return (
    <div className="text-white w-full space-y-4">
      <div className="flex items-start justify-start w-full gap-5">
        <div className="w-60 h-72 bg-slate-800 rounded-md">
          <img
            src={film?.posters[0]?.url}
            alt="Film poster"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="space-y-2 w-3/4">
          <h1 className="font-bold text-5xl">{film?.title}</h1>
          <span className="flex items-center">
            <span>Released &bull;</span>
            <span>
              {film?.releaseDate &&
                new Date(film?.releaseDate).toLocaleDateString()}
            </span>
          </span>
          <p>{film?.overview}</p>
        </div>
      </div>
      <hr className="border border-slate-700 w-full" />
      <div className="w-full space-y-4">
        <h2 className="font-bold text-2xl">Watch Video</h2>
        <div className="w-full h-[400px] bg-black rounded-md">
          <VideoStream filmId={filmId as string} />
        </div>
      </div>

      <div className="w-full space-y-4">
        <h2 className="font-bold text-2xl">Plot Summary</h2>
        <p>{film?.plotSummary}</p>
      </div>
    </div>
  );
}

type Poster = {
  id: string;
  url: string;
  type: string;
  isCover?: boolean;
  isBackdrop?: boolean;
  filmId?: string;
};

type FILM = {
  id: string;
  title: string;
  overview: string;
  plotSummary: string;
  releaseDate: Date;
  comingSoon: boolean;
  yearOfProduction?: number;
  released?: string;
  runtime?: string;
  genre?: string;
  tags: string[];
  type: string;
  embeddedSubtitles?: boolean;
  createdAt?: Date;
  country?: string;
  copyright?: string;
  audienceTarget?: string;
  audienceAgeGroup?: string;
  visibility?: string;
  filmModel?: string;
  status?: string;
  posters: Poster[];
};

function useFilm() {
  const [film, setFilm] = useState<FILM | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFilm = useCallback(async (filmId: string) => {
    if (!filmId) {
      throw new Error('Film ID is required');
    }
    setIsLoading(true);
    const response = await invoke({
      method: 'GET',
      endpoint: `/film/${filmId}`,
    });
    if (response?.error) {
      setIsLoading(false);
      throw new Error(response.error);
    }
    setFilm(response?.res?.film);
    setIsLoading(false);
  }, []);

  return { film, isLoading, fetchFilm };
}

export default Film;
