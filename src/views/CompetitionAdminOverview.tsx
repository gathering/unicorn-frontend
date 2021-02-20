import React from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { View } from '../components/View';
import type { ICompetitionListResponse } from '../features/competitions/competition.types';
import { httpGet } from '../utils/fetcher';

const CompetitionAdminOverview = () => {
    const { data: competitions, isValidating } = useSWR<ICompetitionListResponse>('competitions/competitions', httpGet);

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
                                <Link
                                    to={`/admin/competitions/${c.id}`}
                                    className="p-1 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200"
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
