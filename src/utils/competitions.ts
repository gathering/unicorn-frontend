import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import groupBy from 'lodash/groupBy';
import draftJs from 'draft-js';
import type { ICompetition, IEntry, State } from '../features/competitions/competition';

export const CLOSED = 1;
export const REGISTRATION_OPEN = 2;
export const REGISTRATION_CLOSED = 4;
export const RUNNING_OPEN = 8;
export const RUNNING_CLOSED = 16;
export const VOTING_OPEN = 32;
export const VOTING_CLOSED = 64;
export const SHOWTIME = 128;
export const FINISHED = 256;

export const isExternal = (competition: ICompetition) =>
    !!competition.external_url_info || !!competition.external_url_login;
export const hasPreRegistration = (competition: ICompetition) =>
    !!competition.register_time_start || !!competition.register_time_end;
export const hasVote = (competition: ICompetition) => !!competition.vote_time_start || !!competition.vote_time_end;
export const hasTeams = (competition: ICompetition) => !!competition.team_min || !!competition.team_max;
export const hasFileupload = (competition: ICompetition) => !!competition.fileupload || !!competition.fileupload.length;

export const getFinishedCompetitions = (competitions: ICompetition[]) =>
    competitions.filter((c) => c.state.value === FINISHED);
export const getUnfinishedCompetitions = (competitions: ICompetition[]) =>
    competitions.filter((c) => c.state.value !== FINISHED);
export const filterCompetitionsByState = (competitions: ICompetition[], state: State) =>
    competitions.filter((c) => c.state.value === state);

export const amIParticipantInCompetition = (c: ICompetition) =>
    (c.entries?.length && c.entries.find((e) => e.is_contributor)) || false;
export const amIParticipantInEntryList = (e: IEntry[]) => e.find((ee) => ee.is_contributor) || false;

export const groupCompetitionsByKey = (competitions: ICompetition[], key = 'run_time_start') => {
    dayjs.extend(relativeTime);

    const today = dayjs();

    return groupBy(competitions, (competition: ICompetition) => {
        const startTime = dayjs(competition[key]);

        // Is the competition within the next 24hr?
        if (startTime.isBefore(today.add(24, 'hour')) && startTime.isAfter(today)) {
            // Is the competition within the next 6hr?
            // Format it a bit special
            if (startTime.isBefore(today.add(6, 'hour'))) {
                return `In ${today.to(startTime, true)}`;
            } else {
                return 'Later today';
            }
        }

        return startTime.format('dddd, MMMM D');
    });
};

export const sortByRunTimeStart = (a: ICompetition, b: ICompetition) =>
    dayjs(a.run_time_start).unix() - dayjs(b.run_time_start).unix();

/**
 * Convert draft-js raw output or HTML to ContentState
 * @param {string} rawData Rules in a stringified rawState or HTML format
 */
export const convertRawToContentState = (rawData: string) => {
    let raw = draftJs.ContentState.createFromText('');

    if (typeof rawData === 'string') {
        try {
            raw = draftJs.convertFromRaw(JSON.parse(rawData));
        } catch (_) {
            try {
                const blocksFromHTML = draftJs.convertFromHTML(rawData);
                raw = draftJs.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            } catch (_) {
                raw = draftJs.ContentState.createFromText('');
            }
        }
    }

    return raw;
};

export const competitionPhases = (competition: ICompetition): [string, string, string][] => {
    const phases = ['registration_time', 'run_time', 'vote_time', 'show_time'];

    return phases.map((phase) => [
        phase,
        competition ? competition[phase + '_start'] : undefined,
        competition ? competition[phase + '_end'] : undefined,
    ]);
};

export const findRegisterAction = (competition: ICompetition, ownEntry: IEntry | boolean, isAuthenticated: boolean) => {
    const isExternalCompetition = isExternal(competition);

    // Add functionality based on state
    switch (competition.state.value) {
        case 2: // Register
            if (isExternalCompetition) {
                return 'external';
            }

            if (!isAuthenticated) {
                return 'login';
            }

            if (ownEntry) {
                return 'my_registration';
            } else {
                return 'register';
            }

        case 4: // Show registration
            if (isExternalCompetition) {
                return 'external';
            }

            if (ownEntry && isAuthenticated) {
                return 'my_competition';
            }
            break;

        case 8: // Register or hand in
            if (isExternalCompetition) {
                return 'external';
            }

            if (isAuthenticated) {
                if (ownEntry && !!Object.keys(ownEntry).length) {
                    return 'my_registration';
                } else {
                    if (hasPreRegistration(competition)) {
                        return null;
                    }

                    return 'register';
                }
            } else {
                return 'login';
            }

        case 16: // Show information
            if (isExternalCompetition) {
                return 'external';
            }

            if (ownEntry && isAuthenticated) {
                return 'my_registration';
            }
            break;

        case 256: // Show result details
            if (isExternalCompetition) {
                return null;
            }

            return 'result';

        default:
            return null;
    }
};
