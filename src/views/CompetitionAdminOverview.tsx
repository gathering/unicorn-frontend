import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { View } from '../components/View';
import type { ICompetition, ICompetitionListResponse } from '../features/competitions/competition.types';
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
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                            Competition
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                            Entries
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {competitions.results.map((c) => (
                        <tr key={c.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{c.entries_count}</td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <button
                                    onClick={togglePublish(c)}
                                    className="p-1 ml-4 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200"
                                >
                                    {c.published ? 'Unpublish' : 'Publish'}
                                </button>
                                <Link
                                    to={`/admin/competitions/${c.id}`}
                                    className="p-1 ml-4 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200"
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </View>
    );
};

export default CompetitionAdminOverview;
