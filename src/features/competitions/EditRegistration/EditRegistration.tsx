import React from 'react';
import { toast } from 'react-toastify';
import { httpPatch } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';
import type { ICompetition, IEntry } from '../competition.types';
import { RegisterEntry } from '../RegisterEntry';
import { hasFileupload } from '../../../utils/competitions';

interface IProps {
    competition: ICompetition;
    entry?: IEntry;
    refetchCompetition: () => void;
}

interface IFormData {}

export const EditRegistration = ({ competition, entry, refetchCompetition }: IProps) => {
    const onUpdate = (data: any) => {
        if (!entry) {
            return;
        }
        httpPatch(`competitions/entries/${entry.id}`, JSON.stringify(data))
            .then(() => {
                refetchCompetition();
                toast.success('Updated entry');
            })
            .catch((err) => {
                toast.error('Error updating entry');
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };

    const hasUpload = hasFileupload(competition);

    if (!entry) {
        return null;
    }

    return (
        <>
            <RegisterEntry
                competition={competition}
                defaultValues={{ title: entry.title, crew_msg: entry.crew_msg }}
                onSubmit={onUpdate}
            />
            {hasUpload && (
                <p className="container p-5 mx-auto mb-8 text-xl bg-red-400 rounded-md">
                    File upload will be available soon.
                </p>
            )}
        </>
    );
};
