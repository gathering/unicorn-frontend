import React from 'react';
import { toast } from 'react-toastify';
import { httpPatch } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';
import type { ICompetition, IEntry } from '../competition.types';
import { hasFileupload } from '../../../utils/competitions';
import { RegisterEntry } from '../RegisterEntry';
import { ContributorEditor } from '../ContributorEditor';
import { FileUpload } from '../FileUpload';

interface IProps {
    competition: ICompetition;
    entry?: IEntry;
    onRegistrationFinish: () => void;
}

interface IFormData {}

export const EditRegistration = ({ competition, entry, onRegistrationFinish }: IProps) => {
    const onUpdate = (data: any) => {
        if (!entry) {
            return;
        }
        httpPatch<IEntry>(`competitions/entries/${entry.id}`, JSON.stringify(data))
            .then((d) => {
                onRegistrationFinish();
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

            {hasUpload && <FileUpload competition={competition} entry={entry} />}
            {/* <ContributorEditor /> */}
        </>
    );
};
