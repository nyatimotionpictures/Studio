//CreateFilmTitle Request
export interface CreateNewFilmRequest {
    title: String;
    type: String;
    audioLanguages: String;
    embeddedSubtitles: String;
    subtitleLanguage: String;
    yearOfProduction: String;
    tags: Array<String>;
    genre: Array<String>; 
    overview: String;
    plotSummary: String;

}

interface FilmData {
    title: String;
    type: String;
    audioLanguages: String;
    embeddedSubtitles: String;
    subtitleLanguage: String;
    yearOfProduction: String;
    tags: Array<String>;
    genre: Array<String>; 
    overview: String;
    plotSummary: String;
}

export interface CreateNewFilmResponse {
    message: String;
    film: FilmData;
}