import useSWR from "swr";
import { Link } from "../../../components/Link";
import { View } from "../../../components/View";
import { httpGet } from "../../../utils/fetcher";
import type { ICompetitionListResponse } from "../../competitions/competition";

const CompetitionAdminOverview = () => {
    const { data: competitions } = useSWR<ICompetitionListResponse>("competitions/competitions", httpGet);

    if (!competitions) {
        return null;
    }

    return (
        <View>
            <div className="ring-opacity-5 mx-4 my-8 overflow-hidden rounded-lg shadow-sm ring-1 ring-black dark:ring-white">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-100"
                            >
                                Competition
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:hidden sm:hidden dark:text-gray-100"
                            >
                                Entries
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:hidden dark:text-gray-100"
                            >
                                State
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:hidden"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:hidden"
                            >
                                Voting Start
                            </th>
                            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-800">
                        {competitions.results.map((c) => (
                            <tr key={c.id}>
                                <td className="max-w-0 py-4 pr-3 pl-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {c.name}
                                    <dl className="hidden font-normal md:block sm:block">
                                        <dt className="sr-only">Entries</dt>
                                        <dd className="mt-1 truncate text-gray-700 dark:text-gray-300">
                                            {c.participant_limit
                                                ? `${c.entries_count} entries (${c.participant_limit} limit)`
                                                : `${c.entries_count} entries`}
                                        </dd>
                                        <dt className="sr-only hidden sm:block">State</dt>
                                        <dd className="mt-1 hidden truncate text-gray-500 sm:block">{c.state.label}</dd>
                                        <dt className="sr-only hidden sm:block">Status</dt>
                                        <dd className="mt-1 hidden truncate text-gray-500 sm:block dark:text-gray-400">
                                            {c.published ? "Published" : "Not published"}
                                        </dd>
                                    </dl>
                                </td>
                                <td className="table-cell px-3 py-4 text-sm text-gray-700 md:hidden sm:hidden dark:text-gray-100">
                                    {c.participant_limit
                                        ? `${c.entries_count} (${c.participant_limit} limit)`
                                        : c.entries_count}
                                </td>
                                <td className="table-cell px-3 py-4 text-sm text-gray-700 sm:hidden dark:text-gray-100">
                                    {c.state.label}
                                </td>
                                <td className="table-cell px-3 py-4 text-sm text-gray-700 sm:hidden dark:text-gray-100">
                                    {c.published ? "Published" : "Not published"}
                                </td>
                                <td className="table-cell px-3 py-4 text-sm text-gray-700 sm:hidden">
                                    {c.vote_time_start && new Date(c.vote_time_start).toLocaleString("nb-NO")}
                                </td>
                                <td className="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6">
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
