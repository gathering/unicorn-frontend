import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import useSWR, { mutate } from 'swr';
import styled from 'styled-components';
import Dialog from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import type { ICompetition, IEntry, IFile } from '../features/competitions/competition.types';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { httpGet, httpPatch } from '../utils/fetcher';
import { hasFileupload } from '../utils/competitions';
import { Input } from '../components/Input';
import { View } from '../components/View';
import { Link } from '../components/Link';
import { useForm } from 'react-hook-form';

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

interface IFormData {
    preselect?: boolean;
    comment?: boolean;
}

const CompetitionAdminEntry = () => {
    const { cid, eid } = useParams<{ cid: string; eid: string }>();
    const [showDisqualify, setShowDisqualify] = useState(false);
    const { data: competition, isValidating: isValidatingCompetition } = useSWR<ICompetition>(
        'competitions/competitions/' + cid,
        httpGet
    );
    const { data: entry, mutate } = useSWR<IEntry>('competitions/entries/' + eid, httpGet);
    const { register, errors, handleSubmit, watch } = useForm<IFormData>();

    const preselect = watch('preselect');

    const nextEntry = useMemo(() => {
        if (!competition?.entries) {
            return undefined;
        }

        const index = competition.entries.findIndex((e) => e.id.toString() === eid);
        if (index === -1 || index === competition.entries.length - 1) {
            return undefined;
        }

        return competition.entries[index + 1];
    }, [competition, eid, entry]);

    const previousEntry = useMemo(() => {
        if (!competition?.entries) {
            return undefined;
        }

        const index = competition.entries.findIndex((e) => e.id.toString() === eid);
        if (index === -1 || index === 0) {
            return undefined;
        }

        return competition.entries[index - 1];
    }, [competition, eid, entry]);

    const handleQualify = () => {
        httpPatch(`competitions/entries/${eid}`, JSON.stringify({ status: 4 })).then((d) => mutate(d));
    };
    const handleDisqualify = (formData: IFormData) => {
        if (formData.preselect === true) {
            httpPatch(`competitions/entries/${eid}`, JSON.stringify({ status: 16 })).then((d) => {
                setShowDisqualify(false);
                mutate(d);
            });
        } else {
            httpPatch(`competitions/entries/${eid}`, JSON.stringify({ status: 8, comment: formData.comment })).then(
                (d) => {
                    setShowDisqualify(false);
                    mutate(d);
                }
            );
        }
    };

    if (!competition || !entry) {
        return null;
    }

    const hasUpload = hasFileupload(competition);

    return (
        <View className="container grid grid-cols-3 gap-4 mx-auto my-12 sm:my-0">
            <header className="relative w-full h-48 col-span-3 mb-6">
                <img
                    className="object-cover w-full h-48 rounded-md sm:rounded-none"
                    src={competition.header_image}
                    alt=""
                />
                <HeadingWrapper className="absolute bottom-0 flex items-end w-full h-full px-4 pb-3 text-5xl rounded-md sm:rounded-none text-gray-50">
                    {competition.name}
                </HeadingWrapper>
            </header>
            <section className="col-span-2 bg-white rounded shadow sm:rounded-none">
                <h2 className="p-4 text-xl">
                    {entry.title}
                    <br />
                    <span className="font-light">{entry.owner?.display_name}</span>
                </h2>
            </section>
            <section className="col-span-2 bg-white rounded shadow sm:rounded-none">
                {hasUpload && (
                    <>
                        <h2 className="p-4 text-xl">Files</h2>
                        <ul className="px-4 pb-4">
                            {competition.fileupload.map((fu) => {
                                const file: IFile | undefined = entry.files.find((f) => f.active && f.type === fu.type);
                                return (
                                    <li key={fu.file}>
                                        <h3 className="mt-4 mb-1 text-xl font-light">{fu.input}</h3>
                                        {file ? (
                                            <a
                                                href={file.url}
                                                className="p-1 px-2 -ml-2 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200"
                                            >
                                                {file.name}
                                            </a>
                                        ) : (
                                            <span className="px-2 py-1 text-sm bg-red-200 rounded-md " role="alert">
                                                No file uploaded yet
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </section>
            <aside className="col-start-3 row-span-3 row-start-2">
                <section className="flex flex-col flex-wrap p-4 bg-white rounded shadow sm:rounded-none">
                    <h2 className="text-xl">Status</h2>

                    <p>
                        {entry.status.value === 4
                            ? 'Qualified'
                            : entry.status.value === 8
                            ? `Disqualified: ${entry.comment}`
                            : entry.status.value === 16
                            ? 'Not preselected'
                            : entry.status.label}
                    </p>

                    {entry.status.value !== 4 && (
                        <PrimaryButton className="mt-6 mb-2" onClick={handleQualify}>
                            Qualify
                        </PrimaryButton>
                    )}
                    <SecondaryButton onClick={() => setShowDisqualify(true)}>Disqualify</SecondaryButton>
                </section>
                {(nextEntry || previousEntry) && (
                    <section className="my-6">
                        {previousEntry && (
                            <Link to={`/admin/competitions/${cid}/${previousEntry.id}`} className="mr-6">
                                Previous entry
                            </Link>
                        )}
                        {nextEntry && <Link to={`/admin/competitions/${cid}/${nextEntry.id}`}>Next entry</Link>}
                    </section>
                )}
            </aside>
            <footer className="col-span-3 mt-4">
                <Link to={`/admin/competitions/${cid}`}>Back to competition</Link>{' '}
            </footer>
            <Dialog
                isOpen={showDisqualify}
                onDismiss={() => setShowDisqualify(false)}
                className="rounded-md"
                aria-label={`Disqualify ${entry.title}`}
            >
                <VisuallyHidden>
                    <button className="close-button" onClick={() => setShowDisqualify(false)}>
                        Close
                    </button>
                </VisuallyHidden>
                <h2 className="mb-3 text-xl">Disqualify {entry.title}</h2>
                <p>A reason is required if this is not a result of not being preselected.</p>
                <form onSubmit={handleSubmit(handleDisqualify)}>
                    <label className="block mt-6">
                        <input name="preselect" type="checkbox" className="mr-2" ref={register()} />
                        Not preselected
                    </label>

                    {preselect !== true && (
                        <Input
                            name="comment"
                            ref={register({ required: 'You need to give the participant a reason' })}
                            label="Disqualification reason"
                            helpLabel="This will be displayed to the participant"
                            labelClassName="mt-5"
                            className="w-full"
                            errorLabel={errors.comment?.message}
                        />
                    )}

                    <PrimaryButton className="mt-4">Submit</PrimaryButton>
                </form>
            </Dialog>
        </View>
    );
};

export default CompetitionAdminEntry;
