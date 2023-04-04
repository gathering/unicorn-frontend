import type { Permission } from "../../utils/permissions";

export interface ICompetitionState {
    label: string;
    value: number;
}

export interface IUploadFile {
    file: string;
    type: string;
    input: string;
}

export interface IFile {
    active: boolean;
    id: number;
    name: string;
    obj_type: string;
    status: number;
    type: string;
    url: string;
}

export interface ICompetition {
    brief_description: string;
    contributor_extra: string | null;
    description?: string;
    featured: boolean;
    genre: IGenre;
    header_image: string;
    header_credit: string;
    sponsor_name: string;
    sponsor_logo: string;
    entries_count: number;
    fileupload: IUploadFile[];
    entries?: IEntry[];
    id: number;
    published: boolean;
    name: string;
    obj_type: string;
    rules: string;
    state: ICompetitionState;
    run_time_start: string | null;
    run_time_end: string | null;
    vote_time_start: string | null;
    vote_time_end: string | null;
    show_prestart_lock: string | null;
    show_time_start: string | null;
    show_time_end: string | null;
    register_time_start: string | null;
    register_time_end: string | null;
    permissions: Permission[];
    team_min: number;
    team_max: number;
    team_required?: boolean;
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

interface IEntryStatusDraft {
    value: 1;
    label: string;
}

interface IEntryStatusNew {
    value: 2;
    label: string;
}

interface IEntryStatusQualified {
    value: 4;
    label: string;
}

interface IEntryStatusDisqualified {
    value: 8;
    label: string;
}

interface IEntryStatusNotPreSelected {
    value: 16;
    label: string;
}

interface IEntryStatusInvalid {
    value: 32;
    label: string;
}

type EntryStatus =
    | IEntryStatusDraft
    | IEntryStatusNew
    | IEntryStatusQualified
    | IEntryStatusDisqualified
    | IEntryStatusNotPreSelected
    | IEntryStatusInvalid;

export interface Contributor {
    extra_info?: null | string;
    id: number;
    is_owner: boolean;
    obj_type: "full" | "nested";
    user: {
        display_name: string;
        email: string;
        first_name: string;
        last_name: string;
        obj_type: "nested";
        phone_number: string;
        row: string;
        seat: string;
        uuid: string;
    };
}

export interface IEntry {
    comment?: string;
    contributors: Contributor[];
    participant_limit: number;
    crew_msg?: string;
    files: any[];
    id: number;
    is_contributor: boolean;
    is_owner: boolean;
    obj_type: "full" | "nested";
    order: number;
    score: number;
    screen_msg?: string;
    vote_msg?: string;
    title: string;
    url: string;
    status: EntryStatus;
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
