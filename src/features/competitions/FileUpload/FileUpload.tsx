import React from 'react';
import type { ICompetition, IEntry } from '../competition.types';
import { UploadForm } from './UploadForm';

interface Props {
    competition: ICompetition;
    entry: IEntry;
}

export const FileUpload = ({ competition, entry }: Props) => {
    console.log(competition.fileupload, entry);

    return (
        <section className="container mx-auto mb-6 bg-white rounded sm:rounded-none">
            <h2 className="p-4 text-xl text-center">Upload files</h2>
            <hr className="pb-6 border-t border-gray-300" />
            <ul className="flex">
                {competition.fileupload.map((fu) => (
                    <li key={fu.input + fu.type}>
                        <UploadForm
                            formDefinition={fu}
                            entry={entry}
                            file={entry.files.find((f) => f.active && f.type === fu.type)}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};
