import { Controller, useFormContext } from "react-hook-form";
import useSWR from "swr";
import { Select } from "../../../components/Select";
import { httpGet } from "../../../utils/fetcher";
import type { Genre, IGenreResponse } from "../competition";

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

export const SelectGenre = ({ onForward }: IProps) => {
    const { data: genres } = useSWR<IGenreResponse>("competitions/genres", httpGet);
    const { formState, handleSubmit, control } = useFormContext();

    const onSubmit = () => {
        onForward();
    };

    if (!genres?.results.length) {
        return (
            <>
                <h1 className="mb-8 text-3xl">Create new competition</h1>
                <p className="mb-10 text-gray-700 dark:text-gray-200">
                    No available genres found... Please contact the administrators to configure genres.
                </p>
            </>
        );
    }

    return (
        <>
            <h1 className="mb-8 text-3xl dark:text-gray-100">Create new competition</h1>
            <p className="mb-10 text-gray-700 dark:text-gray-200">
                Some features may be hidden based on what genre you choose. All features will be available after initial
                creation.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="genre"
                    rules={{ required: "You must select a genre" }}
                    render={({ field }) => (
                        <>
                            <Select
                                label="Select genre"
                                options={[...(genres?.results ?? [])].map((g) => ({
                                    label: g.name,
                                    value: g.id.toString(),
                                }))}
                                onChange={(e) => field.onChange(Number(e))}
                                value={field.value?.toString() ?? ""}
                            />
                            {formState.errors.genre?.message && (
                                <label className="mt-1 flex items-center text-red-600 dark:text-red-400">
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="mr-4 h-4 w-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {formState.errors.genre?.message}
                                    </>
                                </label>
                            )}
                        </>
                    )}
                />
                <footer className="mt-8">
                    <button className="flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-500">
                        Forward
                    </button>
                </footer>
            </form>
        </>
    );
};
