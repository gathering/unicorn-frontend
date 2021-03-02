export interface ICompetitionState {
    label: string;
    value: number;
}

export interface ICompetition {
    brief_description: string;
    description?: string;
    featured: boolean;
    genre: IGenre;
    header_image: string;
    entries_count: number;
    entries?: IEntry[];
    id: number;
    name: string;
    obj_type: string;
    rules: string;
    state: ICompetitionState;
    [key: string]: any;
}

export interface ICompetitionListResponse {
    count: number;
    next: null | any;
    previous: null | any;
    results: ICompetition[];
}

export interface IGenreCategory {
    label: string;
    value: Genre;
}

export interface IGenre {
    category: IGenreCategory;
    id: number;
    name: string;
    obj_type: string;
}

export interface IGenreResponse {
    count: number;
    next: null | any;
    previous: null | any;
    results: IGenre[];
    obj_type: string;
}

export interface IEntry {
    comment?: string;
    contributors: [];
    crew_msg?: string;
    files: [];
    id: number;
    is_contributor: boolean;
    is_owner: boolean;
    obj_type: 'full' | 'nested';
    order: number;
    score: number;
    screen_msg?: string;
    title: string;
    url: string;
}

export interface IEntryListResponse {
    results: IEntry[];
}

export enum State {
    Closed = 1,
    RegistrationOpen = 2,
    RegistrationClosed = 4,
    RunningOpen = 8,
    RunningClosed = 16,
    VotingOpen = 32,
    VotingClosed = 64,
    Showtime = 128,
    Finished = 256,
}

export enum Genre {
    OTHER = 1,
    CREATIVE = 2,
    GAME = 4,
    COMMUNITY = 8,
}
