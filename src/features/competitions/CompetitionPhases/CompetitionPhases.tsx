import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ICompetition } from '../competition.types';
import { competitionPhases } from '../../../utils/competitions';
import './competition-phases.scss';

dayjs.extend(relativeTime);

interface IProps {
    competition: ICompetition;
}

interface IDescriptor {
    subject: string;
    start: string;
    end: string;
}

interface IDescriptors {
    [key: string]: IDescriptor;
}

const descriptors: IDescriptors = {
    registration_time: {
        subject: 'Registration',
        start: 'open',
        end: 'close',
    },
    run_time: {
        subject: 'Competition',
        start: 'start',
        end: 'close',
    },
    vote_time: {
        subject: 'Voting',
        start: 'open',
        end: 'close',
    },
    show_time: {
        subject: 'Stage show',
        start: 'start',
        end: 'end',
    },
};

const CompetitionPhases = ({ competition }: IProps) => {
    const phases = useMemo(() => competitionPhases(competition).filter((p) => !!p[1]), [competition]);

    return (
        <div className="flex w-full pb-10 competition-phases">
            {phases.map((phase) => (
                <Phase key={phase[0]} phase={phase} />
            ))}
        </div>
    );
};

const Phase = ({ phase }: { phase: [string, string, string] }) => {
    const [key, start, end] = phase;
    const passedStart = useMemo(() => dayjs().isAfter(start), [start]);
    const passedEnd = useMemo(() => dayjs().isAfter(end), [end]);

    return (
        <>
            <SubPhase
                heading={`${descriptors[key].subject} ${descriptors[key].start}`}
                time={start}
                havePassed={passedStart}
            />
            <SubPhase
                heading={`${descriptors[key].subject} ${descriptors[key].end}`}
                time={end}
                havePassed={passedEnd}
            />
        </>
    );
};

const SubPhase = ({ heading, time, havePassed }: { heading: string; time: string; havePassed: boolean }) => {
    const color = havePassed ? 'green-700' : 'gray-600';

    return (
        <div className={`flex-grow flex flex-col items-center font-light`}>
            <h1 className={`mb-4 text-${color}`}>{heading}</h1>
            <hr
                style={{ height: '2px' }}
                className={`border-0 bg-gray-400 -mb-3 min-w-full bg-${color} ${havePassed ? '' : 'border-dashed'}`}
            />
            <div className={`rounded-full bg-${color} w-6 h-6 border`} />
            <div className="font-light">{dayjs(time).fromNow()}</div>
        </div>
    );
};

export default CompetitionPhases;
