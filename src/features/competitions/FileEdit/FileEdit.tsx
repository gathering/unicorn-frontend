import React from "react";
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
            <ul>
                {!!value.length &&
                    value.map((val, i) => (
                        <li key={i} className="flex items-end mb-2">
                            <File
                                disableRemove={val.type === "main"}
                                onRemove={() => removeFile(i)}
                                onChange={(d) => handleChange(i, d)}
                                forceMain={i === 0}
                                initialValue={val}
                            />
                        </li>
                    ))}
                <li className="flex items-end">
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
                    className="flex items-center h-12 px-4 mt-4 text-base text-red-900 duration-150 bg-red-300 rounded justify-evenly hover:bg-red-700 hover:text-black hover:shadow"
                >
                    Disable file upload
                </button>
            )}
        </fieldset>
    );
};
