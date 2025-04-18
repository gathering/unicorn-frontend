import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useMemo } from "react";
import { Remark } from "react-remark";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import useSWR from "swr";
import { useUserState } from "../context/Auth";
import type { ICompetition, IEntry, IEntryListResponse } from "../features/competitions/competition";
import CompetitionPhases from "../features/competitions/CompetitionPhases";
import { amIParticipantInEntryList, findRegisterAction } from "../utils/competitions";
import { httpGet } from "../utils/fetcher";
import { formatNumber } from "../utils/numbers";
import { hasPermission, Permission } from "../utils/permissions";
import "./CompetitionDetails.scss";

dayjs.extend(advancedFormat);

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

const Content = ({
    competition,
    hasEntry,
    isAuthenticated,
    to,
}: {
    competition: ICompetition;
    hasEntry: IEntry | boolean;
    isAuthenticated: boolean;
    to: string;
}) => {
    const action = findRegisterAction(competition, hasEntry, isAuthenticated);
    const loginUrl = useMemo(() => {
        const url = new URL(import.meta.env.VITE_APP_API + "/oauth/authorize/");
        url.searchParams.append("client_id", import.meta.env.VITE_APP_CLIENT_ID as string);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("redirect_uri", window.location.origin + "/login");

        return url.toString();
    }, []);

    switch (action) {
        case "login":
            return (
                <div className="mb-6 text-right">
                    <a
                        href={loginUrl}
                        className="rounded-sm p-2 px-1 text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:text-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-100"
                    >
                        Log in to register
                    </a>
                </div>
            );

        case "register":
            return (
                <Link
                    to={to + "/register"}
                    className="mb-6 flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base font-semibold text-green-800 duration-150 hover:bg-green-700 hover:text-black hover:shadow"
                >
                    Register now!
                </Link>
            );

        case "my_registration":
            return (
                <Link
                    to={to + "/register/"}
                    className="mb-6 flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base font-semibold text-green-800 duration-150 hover:bg-green-700 hover:text-black hover:shadow"
                >
                    Check out your registration
                </Link>
            );

        case "result":
            return null;

        // case 'external':
        //     return (
        //         <Segment basic>
        //             <Header as="a" href={competition.external_url_info} color="orange">
        //                 This is an externally hosted competition, click here for more information!
        //             </Header>
        //             <br />
        //             <Header size="small" as="a" href={competition.external_url_login} color="grey">
        //                 Direct to login
        //             </Header>
        //         </Segment>
        //     );

        default:
            return null;
    }
};

const CompetitionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useUserState();
    const { data } = useSWR<ICompetition>("competitions/competitions/" + id, httpGet);

    const { data: entries } = useSWR<IEntryListResponse>(
        `competitions/entries/?competition_id=${id}&limit=1000`,
        httpGet,
        {
            revalidateOnFocus: false,
        }
    );

    const hasEntry = useMemo(() => (entries ? amIParticipantInEntryList(entries.results) : false), [entries]);
    const hasMeta = useMemo(() => !!data?.prizes.length || !!data?.links.length || data?.sponsor_name, [data]);

    if (!data) {
        // TODO Return loading component
        return null;
    }

    return (
        <div className="container mx-auto my-12 sm:my-0">
            <div className="relative mb-10 sm:mb-6">
                <img
                    className="h-48 w-full rounded-md object-cover sm:rounded-none"
                    src={data.header_image_file ?? data.header_image}
                    alt=""
                />
                <HeadingWrapper className="absolute bottom-0 flex h-full w-full items-end rounded-md px-4 pb-3 text-5xl text-gray-50 sm:rounded-none">
                    {data.name}
                </HeadingWrapper>
                <p className="absolute bottom-0 right-0 px-4 py-2 text-sm text-gray-200 sm:top-0">
                    Image by: {data.header_credit}
                </p>
            </div>
            <div className="flex-horizontal flex sm:flex-col-reverse">
                <div className="flex-grow">
                    {data.state.value === 32 && (
                        <section
                            className="container col-span-2 mx-auto mb-6 mt-4 w-full border-l-4 border-green-500 bg-green-100 px-3 py-5 text-green-700"
                            role="alert"
                        >
                            <p>
                                <strong>Voting is open! </strong>{" "}
                                {user ? "Cast your votes now!" : "Please log in to cast your votes!"}
                            </p>
                        </section>
                    )}
                    <CompetitionPhases competition={data} />
                    <TabGroup className="rounded bg-white dark:bg-gray-800 sm:rounded-none">
                        <TabList className="flex text-lg font-light">
                            {data.description && (
                                <Tab className="data-[selected]:borger-b-2 flex-grow border-b py-3 data-[selected]:border-tg-brand-orange-500">
                                    Information
                                </Tab>
                            )}
                            <Tab className="data-[selected]:borger-b-2 flex-grow border-b py-3 data-[selected]:border-tg-brand-orange-500">
                                Rules
                            </Tab>
                        </TabList>
                        <TabPanels className="p-4">
                            {data.description && (
                                <TabPanel>
                                    <div className="prose max-w-full">
                                        <Remark>{data.description}</Remark>
                                    </div>
                                </TabPanel>
                            )}
                            <TabPanel>
                                <div className="prose max-w-full">
                                    <Remark>{data.rules}</Remark>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
                <aside style={{ minWidth: "20rem" }} className="ml-10 mt-4 sm:mx-2 sm:my-0">
                    {!!user && data.state.value === 32 && (
                        <Link
                            to={`/competitions/${id}/vote`}
                            className="mb-0 flex items-center justify-center rounded-lg bg-tg-brand-orange-500 px-7 py-4 text-xl text-white transition-all duration-150 hover:scale-105 hover:bg-tg-brand-orange-600 hover:font-semibold"
                        >
                            Vote!
                            <span className="pl-2">🎉</span>
                        </Link>
                    )}

                    <Content
                        competition={data}
                        isAuthenticated={!!user}
                        to={`/competitions/${id}`}
                        hasEntry={hasEntry}
                    />

                    {hasPermission(Permission.CompetitionsChangeCompetition, data.permissions) && (
                        <>
                            <Link
                                to={`/admin/competitions/${id}/edit`}
                                className="mb-10 mt-10 flex h-12 items-center justify-evenly rounded bg-yellow-300 px-4 text-base font-semibold text-yellow-800 duration-150 hover:bg-yellow-700 hover:text-black hover:shadow sm:mb-6 sm:mt-6"
                            >
                                Edit
                            </Link>
                            <Link
                                to={`/admin/competitions/${id}`}
                                className="mb-10 mt-10 flex h-12 items-center justify-evenly rounded bg-blue-300 px-4 text-base font-semibold text-blue-800 duration-150 hover:bg-blue-700 hover:text-black hover:shadow sm:mb-6 sm:mt-6"
                            >
                                Entries
                            </Link>
                        </>
                    )}

                    {hasMeta && (
                        <section className="rounded bg-white p-4 dark:bg-gray-800 sm:rounded-none">
                            {!!data.prizes.length && (
                                <>
                                    <h2 className="pb-2 text-lg">Prizes</h2>
                                    <table className="mt-2 pb-4 leading-8">
                                        <thead className="sr-only">
                                            <tr>
                                                <th>Place</th>
                                                <th>Prize</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.prizes.map((prize: string, i: number) => (
                                                <tr
                                                    key={prize + i.toString()}
                                                    className="pr-3 align-top font-light text-gray-600 dark:text-gray-200"
                                                >
                                                    <td>{formatNumber(i + 1)}</td>
                                                    <td>
                                                        <span className="float-right">{prize}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {!!data.sponsor_name && (
                                <>
                                    <h2 className="pb-2 text-lg">Powered By</h2>
                                    <div className="mx-auto mt-2 w-64 pb-4 dark:bg-gray-100">
                                        <img src={data.sponsor_logo} alt={data.sponsor_name} className="p-2" />
                                    </div>
                                </>
                            )}

                            {!!data.links.length && (
                                <>
                                    <h2 className="pb-2 text-lg">Links</h2>
                                    <ul className="mt-2 w-2/3 leading-8">
                                        {data.links.map((link, idx) => (
                                            <li key={idx}>
                                                <a
                                                    href={link.href}
                                                    target="_blank"
                                                    className="rounded-sm px-1 py-1 capitalize text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:px-2 hover:text-indigo-900"
                                                    rel="noreferrer noopener"
                                                >
                                                    {link.destination}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default CompetitionDetails;
