export type ADMIN = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password?: string;
  role: string;
  imageURL?: string;
  privileges?: string;
  active?: boolean;

  createdAt?: string;
};

export type FILM = {
  id: string;
  title: string;
  overview: string;
  plotSummary: string;
  releaseDate: Date;
  comingSoon: boolean;
  yearOfProduction?: number;
  released?: boolean;
  runtime?: number;
  genre?: string[];
  tags?: string[];
  enableDonation?: boolean;
  type: 'movie' | 'series' | 'documentary';
  audioLanguage?: AUDIOLANGUAGE[];
  subtitleLanguage?: SUBTITLELANGUAGE[];
  posters?: POSTER[];
  cast?: CAST[];
  crew?: CREW[];
  season?: SEASON[];
  video?: VIDEO[];
  likes?: number | string;
  views?: number | string;
  rating?: number | string;
};

export type AUDIOLANGUAGE = {
  id: string;
  name: string;
  iso_639_1: string;

  createdAt?: Date;
};

export type SUBTITLELANGUAGE = {
  id: string;
  language: string;
  createdAt?: Date;
};

export type POSTER = {
  id: string;
  type: string;
  url: string;
  isCover: boolean;
  isBackdrop: boolean;
};

export type CAST = {
  id: string;
  name: string;
  role: string;
  imageURL: string;
};

export type CREW = {
  id: string;
  producer: string;
  coProducers: string[];
  director: string;
  writers: string[];
  music: string[];
  cinematography: string[];
  editing: string[];
  production: string[];
  animation: string[];
  sound: string[];
  casting: string[];
};

export type SEASON = {
  id: string;
  title: string;
  overview: string;
  season: number;
  episodes: EPISODE[];

  createdAt?: Date;
};

export type EPISODE = {
  id: string;
  title: string;
  overview: string;
  episode: number;
  video: VIDEO[];

  createdAt?: Date;
};

export type VIDEO = {
  id: string;
  url: string;
  name: string;
  isTrailer: boolean;
  format: string;
  fps?: string;
  resolution?: string;
  bitrate?: string;
  size?: string;
  codec?: string;
  encoding?: string;
  duration?: number | string;
};
