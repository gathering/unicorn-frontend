import React, { useMemo } from "react";
import dayjs from "dayjs";
import isYesterday from "dayjs/plugin/isYesterday";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import type { ICompetition } from "../competition";
import { competitionPhases } from "../../../utils/competitions";
import "./competition-phases.scss";
import clsx from "clsx";

dayjs.extend(isYesterday);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

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
        subject: "Registration",
        start: "open",
        end: "close",
    },
    run_time: {
        subject: "Competition",
        start: "start",
        end: "close",
    },
    vote_time: {
        subject: "Voting",
        start: "open",
        end: "close",
    },
    show_time: {
        subject: "Stage show",
        start: "start",
        end: "end",
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
    const color = havePassed ? "green-700" : "gray-600";

    return (
        <section className={`flex-grow flex flex-col items-center font-light`}>
            <h2 className={`mb-4 text-${color}`}>{heading}</h2>
            <hr
                style={{ height: "2px" }}
                className={clsx(
                    "border-0 bg-gray-400 -mb-3 min-w-full",
                    {
                        "bg-green-700": havePassed,
                        "bg-gray-600": !havePassed,
                    },
                    {
                        "border-dashed": havePassed,
                    },
                )}
            />
            <div className={`rounded-full bg-${color} w-6 h-6 border`} />
            <div className="flex flex-col items-center font-light">
                <span title={dayjs(time).format("DD MMM YYYY HH:mm")}>
                    {dayjs(time).isYesterday()
                        ? "Yesterday"
                        : dayjs(time).isToday()
                          ? "Today"
                          : dayjs(time).isTomorrow()
                            ? "Tomorrow"
                            : dayjs(time).format("dddd DD. MMMM")}
                </span>
                <span>{dayjs(time).format("HH:mm")}</span>
            </div>
        </section>
    );
};

export default CompetitionPhases;
