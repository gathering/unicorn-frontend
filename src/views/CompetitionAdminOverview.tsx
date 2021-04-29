import React from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { View } from '../components/View';
import { Link } from '../components/Link';
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
            <div className="admingrid mx-5 my-5">
                    {competitions.results.map((c) => (
                        <div className="mt-2.5 mb-1 mr-10">
                            <span className="text-4xl pt-20px mb-3">{c.name}</span>
                            <div className="bg-yellow-200 mr-5">
                                <p>Partisipants: {c.participant_limit ? `${c.entries_count}/${c.participant_limit}` : c.entries_count}</p>
                                <div>
                                    <div>Status: {c.published ? 'Published' : 'Not published'}</div>
                                    <div>PLACEHOLDER compo progress mini bar</div>
                                </div>
                            </div>
                            <Link
                                to={`/admin/competitions/${c.id}`}
                                className="">
                                View
                            </Link>
                            <Link
                                to={`/admin/competitions/${c.id}/edit`}
                                className=" ">
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>

        </View>
    );
};

export default CompetitionAdminOverview;
