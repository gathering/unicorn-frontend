import { FormEventHandler, useState } from "react";
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

    const updateContributorExtra: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!inputValue) {
            return;
        }

        httpPatch(
            `competitions/contributors/${contributor.id}`,
            JSON.stringify({
                extra_info: inputValue,
            }),
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
                                <Input
                                    required
                                    label={contributorExtra}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
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
                <div className="flex items-end justify-end flex-1 gap-4">
                    {contributorExtra && <button className="">Update</button>}
                    {iAmContributorOwner && !contributor.is_owner && (
                        <button onClick={removeContributor} type="button">
                            Remove
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};
