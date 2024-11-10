import React, { useCallback } from 'react';
import { invoke } from '../lib/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

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

type Poster = {
  id: string;
  url: string;
  type: string;
  isCover?: boolean;
  isBackdrop?: boolean;
  filmId?: string;
};

const useFilms = () => {
  const { user } = useAuth();
  const [films, setFilms] = React.useState<FILM[]>([]);

  const fetchFilms = useCallback(async () => {
    const response = await invoke<{ films: FILM[] }>({
      method: 'GET',
      endpoint: '/film/all',
    });
    if (response?.error) {
      throw new Error(response.error);
    }
    setFilms(response?.res?.films ?? []);
  }, []);

  const deleteFilm = async (filmId: string) => {
    if (!filmId) {
      throw new Error('Film ID is required');
    }
    const response = await invoke<{ message: string | null }>({
      method: 'DELETE',
      endpoint: `/film/delete/${filmId}`,
      data: { adminId: user?.id },
    });

    if (response?.error) {
      throw new Error(response.error);
    }

    if (response?.status === 200) {
      setFilms((prev) => prev.filter((film: FILM) => film?.id !== filmId));
    }
    return response?.res;
  };

  return { films, fetchFilms, deleteFilm };
};

function Films() {
  const { isAuthenticated, user } = useAuth();
  const { films, fetchFilms } = useFilms();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    fetchFilms();
  }, [fetchFilms, isAuthenticated]);

  if (!isAuthenticated) {
    return <h1>Login to start watching ...💆 </h1>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg uppercase">Films</h3>
        {user?.role === 'admin' && (
          <Link
            to="/admin/new-film"
            className="bg-teal-600 text-orange-50 p-2 rounded-md">
            Add Film 📼
          </Link>
        )}
      </div>
      <div className="h-auto w-full space-y-4">
        {films.length ? (
          films.map((film: { id: string; title: string }) => (
            <Film key={film.id} film={film} />
          ))
        ) : (
          <p>No films available</p>
        )}
      </div>
    </div>
  );
}

const Film = ({ film }: { film: { id: string; title: string } }) => {
  const { deleteFilm } = useFilms();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const confirm = window.confirm(
      'Are you sure you want to delete this film?',
    );

    if (!confirm) {
      setLoading(false);
      return;
    }

    try {
      const response = await deleteFilm(film.id);
      setLoading(false);

      alert(response?.message ?? 'Film deleted successfully');
    } catch (error) {
      setLoading(false);
      alert('An error occurred');
      return;
    }
  };
  return (
    <div key={film.id} className="flex flex-col items-start gap-2 h-auto">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-bold capitalize">{film.title}</h3>
        <div className="flex items-center gap-5">
          <Link to={`/admin/film/${film?.id}`} className="cursor-pointer">
            View more 👀
          </Link>
          {user?.role === 'admin' && (
            <button
              disabled={loading}
              className="underline"
              onClick={handleDelete}>
              {loading ? 'Deleting...' : 'Delete ❌'}
            </button>
          )}
        </div>
      </div>
      {/* {show && (
        <div className="h-full w-full">
          {show && <VideoStream filmId={film?.id} />}
        </div>
      )} */}
    </div>
  );
};

export default Films;
