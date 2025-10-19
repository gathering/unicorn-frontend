import useSWR from "swr";
import { httpGet } from "../../../utils/fetcher";
import type { ICompetition, IEntry } from "../competition";
import { UploadForm } from "./UploadForm";

interface Props {
    competition: ICompetition;
    entry: IEntry;
}

export const FileUpload = ({ competition, entry }: Props) => {
    // local copy to prevent flash...
    const { data: _entry, mutate } = useSWR<IEntry>(`competitions/entries/${entry.id}`, httpGet, {
        revalidateOnFocus: false,
    });

    return (
        <section className="container mx-auto mb-6 rounded-sm bg-white sm:rounded-none dark:bg-gray-800">
            <h2 className="p-4 text-center text-xl">Upload files</h2>
            <hr className="border-t border-gray-300 pb-6 dark:border-gray-700" />

            {competition.fileupload.length === 0 && (
                <p className="pb-6 text-center text-red-700">
                    Uploading files is enabled on this competition, but the organizer has not specified which files to
                    upload yet.
                </p>
            )}

            <ul className="flex">
                {competition.fileupload.map((fu) => (
                    <li key={fu.input + fu.type}>
                        <UploadForm
                            onRefresh={mutate}
                            formDefinition={fu}
                            entry={_entry ?? entry}
                            file={(_entry ?? entry).files.find((f) => f.active && f.type === fu.type)}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};
