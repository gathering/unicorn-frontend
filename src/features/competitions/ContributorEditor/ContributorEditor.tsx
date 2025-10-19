import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Input } from "../../../components/Input";
import { useUserState } from "../../../context/Auth";
import { httpGet, httpPost } from "../../../utils/fetcher";
import type { ICompetition, IEntry } from "../competition";
import { Contributor } from "./Contributor";

interface Props {
    contributorExtra?: string | null;
    entry: IEntry;
    competition: ICompetition;
    revalidate: VoidFunction;
}

export const ContributorEditor = ({ contributorExtra, entry, competition, revalidate }: Props) => {
    const { user } = useUserState();
    const [showAddContributor, setShowAddContributor] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchInput, setSearchInput] = useState("");
    const [addContributorError, setAddContributorError] = useState<Array<string>>();

    const { data } = useSWR<{
        count: number;
        next: null | number;
        previous: null | number;
        results: Array<{
            display_name: string;
            obj_type: "nested";
            uuid: string;
        }>;
    }>(
        () => {
            const baseUrl = "accounts/search/";
            const searchParams = new URLSearchParams();
            searchParams.set("q", searchInput);

            return `${baseUrl}?${searchParams.toString()}`;
        },
        httpGet,
        { revalidateOnFocus: false }
    );

    const handleUserSearch = () => {
        if (searchRef.current) {
            setSearchInput(searchRef.current.value);
        }
    };

    const handleAddContributor = (uuid: string) => {
        setAddContributorError([]);
        httpPost(
            "competitions/contributors",
            JSON.stringify({
                entry: entry.id,
                user: uuid,
                extra_info: null,
                is_owner: false,
            })
        )
            .then(() => {
                setShowAddContributor(false);
                revalidate();
            })
            .catch((err) => {
                const errorBody = err.body;

                const errors = Object.values(errorBody).flat() as Array<string>;

                if (errors.length) {
                    return setAddContributorError(errors);
                }

                if (!errorBody) {
                    toast.error("Something went wrong when adding the contributor");
                }
            });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto my-12 sm:my-0">
            <section className="flex flex-col rounded-sm bg-white sm:rounded-none">
                <h2 className="p-4 text-center text-xl">Edit contributors</h2>
                <hr className="border-t border-gray-300 pb-6" />
                <fieldset className="mx-4">
                    <legend className="mb-5">Contributors on your team</legend>

                    {(competition.team_min > 1 || competition.team_max > 1) && (
                        <p className="mb-6 text-orange-600">
                            {competition.team_min > 1 &&
                                `This competition requires a minimum of ${competition.team_min} contributors.`}
                            {competition.team_max > 1 &&
                                `There can maximum be ${competition.team_max} contributors registered.`}
                        </p>
                    )}

                    {entry.contributors.map((contributor, i) => (
                        <>
                            <Contributor
                                contributor={contributor}
                                entry={entry}
                                user={user}
                                contributorExtra={contributorExtra}
                                revalidate={revalidate}
                            />
                            {i !== entry.contributors.length - 1 && <hr className="my-6 border-t border-gray-300" />}
                        </>
                    ))}
                </fieldset>
                <hr className="my-6 border-t border-gray-300" />

                <div className="flex justify-between">
                    {competition.team_max > 0 && entry.contributors.length < competition.team_max && (
                        <button
                            className="m-4 mb-6 flex h-12 items-center justify-evenly rounded-sm bg-blue-300 px-4 text-base text-blue-900 duration-150 hover:bg-blue-700 hover:text-black hover:shadow-sm"
                            onClick={() => setShowAddContributor(true)}
                            type="button"
                        >
                            Add participant
                        </button>
                    )}
                </div>
            </section>

            <Transition appear show={showAddContributor} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setShowAddContributor(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="bg-opacity-25 fixed inset-0 bg-black" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Add contributor
                                    </DialogTitle>
                                    <p className="mt-4 mb-6 text-orange-600">
                                        All contributors must have been logged into competitions.gathering.org before
                                        you can add them.
                                    </p>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUserSearch();
                                        }}
                                        className="mb-6"
                                    >
                                        <Input label="Name, nickname or email" className="mb-4" ref={searchRef} />
                                        <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                            Search
                                        </button>
                                    </form>

                                    {!!addContributorError?.length && (
                                        <>
                                            <p className="font-medium text-red-700">
                                                An error occured adding the contributor:
                                            </p>
                                            <ul className="mb-6 text-red-500">
                                                {addContributorError.map((err, idx) => (
                                                    <li key={idx}>{err}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    {data && (
                                        <>
                                            {data.results.length ? (
                                                <>
                                                    Search results:
                                                    <ul>
                                                        {(data?.results ?? []).map((result, idx) => (
                                                            <li key={idx}>
                                                                <button
                                                                    className="rounded-xs px-2 py-1 text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:text-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-100"
                                                                    onClick={() => handleAddContributor(result.uuid)}
                                                                >
                                                                    {result.display_name}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            ) : (
                                                <p>
                                                    No participants found for <i>{searchInput}</i>. Search by first
                                                    name, last name, nick or email.
                                                </p>
                                            )}
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        className="float-right inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => setShowAddContributor(false)}
                                    >
                                        Cancel
                                    </button>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};
