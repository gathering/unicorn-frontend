import { type SubmitEventHandler, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "../../../components/Input";
import type { User } from "../../../context/Auth";
import { httpDelete, httpPatch } from "../../../utils/fetcher";
import type { Contributor as IContributor, IEntry } from "../competition";

interface Props {
    contributor: IContributor;
    contributorExtra?: string | null;
    user: User;
    entry: IEntry;
    revalidate: VoidFunction;
}

export const Contributor = ({ contributor, contributorExtra, user, entry, revalidate }: Props) => {
    const iAmContributorOwner = entry.contributors.some((e) => e.is_owner && e.user.uuid === user?.uuid);
    const [inputValue, setInputValue] = useState(contributor.extra_info ?? "");

    const updateContributorExtra: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!inputValue) {
            return;
        }

        httpPatch(
            `competitions/contributors/${contributor.id}`,
            JSON.stringify({
                extra_info: inputValue,
            })
        )
            .then(() => {
                toast.success("Contributor updated");
            })
            .catch(() => {
                toast.error("Something went wrong updating the contributor");
            });
    };

    const removeContributor = () => {
        httpDelete(`competitions/contributors/${contributor.id}`)
            .then(() => {
                toast.success("Contributor removed");
                revalidate();
            })
            .catch();
    };

    return (
        <>
            <form className="flex" onSubmit={updateContributorExtra}>
                <div>
                    <span className="font-medium">{contributor.user.display_name}</span>
                    {contributorExtra && (
                        <>
                            {iAmContributorOwner || contributor.user.uuid === user?.uuid ? (
                                <div>
                                    <Input
                                        required
                                        label={contributorExtra}
                                        value={inputValue}
                                        maxLength={64}
                                        size={64}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    <p
                                        className={`mt-1 text-sm ${inputValue.length >= 64 ? "text-red-500" : "text-gray-500"}`}
                                    >
                                        {inputValue.length}/64 characters
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {contributor.extra_info ? (
                                        <p>{contributor.extra_info}</p>
                                    ) : (
                                        <p className="text-red-500">
                                            Contributor has not set <i>{contributorExtra}</i> yet.
                                        </p>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className="flex flex-1 items-end justify-end gap-4">
                    {contributorExtra && (
                        <button className="flex h-12 items-center justify-evenly rounded-sm bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow-sm">
                            Update
                        </button>
                    )}
                    {iAmContributorOwner && !contributor.is_owner && (
                        <button
                            onClick={removeContributor}
                            type="button"
                            className="flex h-12 items-center justify-evenly rounded-sm bg-red-300 px-4 text-base text-red-900 duration-150 hover:bg-red-700 hover:text-black hover:shadow-sm"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};
