import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { httpPatch } from '../../../utils/fetcher';
import { useUserState } from '../../../context/Auth';
import { parseError } from '../../../utils/error';
import type { ICompetition, IEntry } from '../competition.types';
import { RegisterEntry } from '../RegisterEntry';

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

    if (!entry) {
        return null;
    }

    return (
        <RegisterEntry
            competition={competition}
            defaultValues={{ title: entry.title, crew_msg: entry.crew_msg }}
            onSubmit={onUpdate}
        />
    );
};
