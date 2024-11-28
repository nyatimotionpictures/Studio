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

export interface UpdateFilmRequest {
    id: String;
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

export interface FilmData {
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

/** getfilms */
export interface GetAllFilms {
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



/** get film */

export interface GetFilmRequest {
    id: String
}
export interface GetSingleFilmResponse {
    
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

export interface filmDeleteResponse {
    message: String
}