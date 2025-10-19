import { toast } from "react-toastify";
import { hasFileupload } from "../../../utils/competitions";
import { parseError } from "../../../utils/error";
import { httpPatch } from "../../../utils/fetcher";
import type { ICompetition, IEntry } from "../competition";
import { ContributorEditor } from "../ContributorEditor";
import { FileUpload } from "../FileUpload";
import { RegisterEntry } from "../RegisterEntry";

interface IProps {
    competition: ICompetition;
    entry?: IEntry;
    onRegistrationFinish: () => void;
    revalidate: VoidFunction;
}

export const EditRegistration = ({ competition, entry, onRegistrationFinish, revalidate }: IProps) => {
    const onUpdate = (data: any) => {
        if (!entry) {
            return;
        }
        httpPatch<IEntry>(`competitions/entries/${entry.id}`, JSON.stringify(data))
            .then(() => {
                onRegistrationFinish();
                toast.success("Updated entry");
            })
            .catch((err) => {
                toast.error("Error updating entry");
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };

    const hasUpload = hasFileupload(competition);

    if (!entry) {
        return null;
    }

    return (
        <>
            {entry.status.value === 4 ? (
                <section
                    className="col-span-2 container mx-auto mt-4 w-full border-l-4 border-green-500 bg-green-100 px-3 py-4 text-green-700"
                    role="alert"
                >
                    <h2 className="pb-2 font-bold">Congratulations! 🥳</h2>
                    <p>Your entry qualified for {competition.name}</p>
                </section>
            ) : entry.status.value === 8 ? (
                <section
                    className="col-span-2 container mx-auto mt-4 w-full border-l-4 border-yellow-500 bg-yellow-100 px-3 py-4 text-yellow-700"
                    role="alert"
                >
                    <h2 className="pb-2 font-bold">Sorry, your entry is disqualified:</h2>
                    <p>{entry.comment}</p>
                    <p className="mt-4">Please contact the crew if you have any questions.</p>
                </section>
            ) : entry.status.value === 16 ? (
                <section
                    className="col-span-2 container mx-auto mt-4 w-full border-l-4 border-yellow-500 bg-yellow-100 px-3 py-4 text-yellow-700"
                    role="alert"
                >
                    <h2 className="pb-2 font-bold">Your registration did not make it through the preselection</h2>
                    <p>Please contact the crew if you have any questions.</p>
                </section>
            ) : null}

            <RegisterEntry
                competition={competition}
                defaultValues={{ title: entry.title, crew_msg: entry.crew_msg }}
                onSubmit={onUpdate}
                exists={true}
            />
            {hasUpload && <FileUpload competition={competition} entry={entry} />}
            <ContributorEditor
                revalidate={revalidate}
                entry={entry}
                contributorExtra={competition.contributor_extra}
                competition={competition}
            />
        </>
    );
};
