import { File } from "./File";

type FileType = "archive" | "music" | "picture" | "video";
type InputType = "main" | "screenshot" | "progress1" | "progress2" | "progress3" | "other";

interface IUploadFile {
    input: string;
    file: FileType;
    type: InputType;
}

interface IProps {
    label?: string;
    onChange: (v: any) => void;
    value: IUploadFile[];
}

export const FileEdit = ({ label, onChange, value }: IProps) => {
    const handleChange = (index: number, d: IUploadFile) => {
        const newFileList = [...value];
        newFileList[index] = d;
        onChange(newFileList);
    };
    const onAdd = (d: IUploadFile) => {
        onChange([...value, d]);
    };

    const removeFile = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const onClear = () => {
        onChange([]);
    };

    return (
        <fieldset className="mb-6">
            <legend className="mb-2">{label ?? "Upload Files"}</legend>
            <span>Remember to save the form after updating a field</span>
            <div className="my-3 rounded-sm border border-yellow-500 bg-yellow-100 p-3 text-sm text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200">
                <strong>Note:</strong> The file with type &quot;Main entry&quot; is used for voting and entry exports to
                ftp.gathering.org. It should most often not be a zip file.
            </div>
            <ul>
                {!!value.length &&
                    value.map((val, i) => (
                        <li key={i} className="mb-2">
                            <File
                                disableRemove={val.type === "main"}
                                onRemove={() => removeFile(i)}
                                onChange={(d) => handleChange(i, d)}
                                forceMain={i === 0}
                                initialValue={val}
                            />
                        </li>
                    ))}
                <li>
                    <File
                        forceMain={!value.length}
                        addNew
                        onChange={(d) => {
                            onAdd(d);
                        }}
                    />
                </li>
            </ul>
            {!!value.length && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 flex h-12 items-center justify-evenly rounded-sm bg-red-300 px-4 text-base text-red-900 duration-150 hover:bg-red-700 hover:text-black hover:shadow-sm"
                >
                    Disable file upload
                </button>
            )}
        </fieldset>
    );
};
