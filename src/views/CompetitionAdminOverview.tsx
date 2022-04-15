import React from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { View } from '../components/View';
import { Link } from '../components/Link';
import type { ICompetition, ICompetitionListResponse } from '../features/competitions/competition';
import { httpGet, httpPatch } from '../utils/fetcher';
import { parseError } from '../utils/error';

const CompetitionAdminOverview = () => {
    const { data: competitions, revalidate } = useSWR<ICompetitionListResponse>('competitions/competitions', httpGet);

    const togglePublish = (c: ICompetition) => () => {
        httpPatch(`competitions/competitions/${c.id}`, JSON.stringify({ published: !c.published }))
            .then((d) => revalidate())
            .catch((err) => parseError(err).forEach((e: any) => toast.error(e)));
    };

    if (!competitions) {
        return null;
    }

    return (
        <View>
            <div className="mx-4 mt-8 overflow-hidden shadow ring-1 ring-black dark:ring-white ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                            >
                                Competition
                            </th>
                            <th
                                scope="col"
                                className="sm:hidden md:hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 table-cell"
                            >
                                Entries
                            </th>
                            <th
                                scope="col"
                                className="sm:hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 table-cell"
                            >
                                Status
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-800">
                        {competitions.results.map((c) => (
                            <tr key={c.id}>
                                <td className="max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {c.name}
                                    <dl className="hidden font-normal md:block sm:block">
                                        <dt className="sr-only">Entries</dt>
                                        <dd className="mt-1 truncate text-gray-700 dark:text-gray-300">
                                            {c.participant_limit
                                                ? `${c.entries_count} entries (${c.participant_limit} limit)`
                                                : `${c.entries_count} entries`}
                                        </dd>
                                        <dt className="sr-only hidden sm:block">Status</dt>
                                        <dd className="hidden mt-1 truncate text-gray-500 dark:text-gray-400 sm:block">
                                            {c.published ? 'Published' : 'Not published'}
                                        </dd>
                                    </dl>
                                </td>
                                <td className="sm:hidden md:hidden px-3 py-4 text-sm text-gray-700 dark:text-gray-100 table-cell">
                                    {c.participant_limit
                                        ? `${c.entries_count} (${c.participant_limit} limit)`
                                        : c.entries_count}
                                </td>
                                <td className="sm:hidden px-3 py-4 text-sm text-gray-700 dark:text-gray-100 table-cell">
                                    {c.published ? 'Published' : 'Not published'}
                                </td>
                                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <Link to={`/admin/competitions/${c.id}`} className="mr-6">
                                        View<span className="sr-only">, {c.name}</span>
                                    </Link>
                                    <Link to={`/admin/competitions/${c.id}/edit`} className="mr-2">
                                        Edit<span className="sr-only">, {c.name}</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </View>
    );
};

export default CompetitionAdminOverview;
