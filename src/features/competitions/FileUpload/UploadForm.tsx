import React, { type ChangeEvent, useEffect, useState } from "react";
import * as tus from "tus-js-client";
import type { IEntry, IFile, IUploadFile } from "../competition";
import { getToken } from "../../../utils/fetcher";
import { useId } from "@reach/auto-id";

const FILE_PICTURE = {
    types: ["png", "jpg"],
};

const FILE_ARCHIVE = {
    types: ["zip", "rar"],
};

const FILE_MUSIC = {
    types: ["mp3", "wav"],
};

const FILE_VIDEO = {
    types: ["mp4 h264"],
};

const getFileConstant = (file: string) => {
    switch (file) {
        case "picture":
            return FILE_PICTURE;

        case "archive":
            return FILE_ARCHIVE;

        case "music":
            return FILE_MUSIC;

        case "video":
            return FILE_VIDEO;

        default:
            return { types: [] };
    }
};

interface Props {
    formDefinition: IUploadFile;
    entry: IEntry;
    file: IFile;
    onRefresh: () => void;
}

export const UploadForm = ({ formDefinition, entry, file, onRefresh }: Props) => {
    const inputId = `unicorn-upload-input--${useId()}`;
    const [progress, setProgress] = useState("0");
    const [stage, setStage] = useState(1);

    useEffect(() => {
        if (file) {
            setStage(3);
        }
    }, [file]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const token = getToken();

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const upload = new tus.Upload(file, {
            endpoint: import.meta.env.VITE_APP_API + "/upload/",
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            chunkSize: 15 * 1024 * 1024,
            headers: {
                "X-Unicorn-Entry-Id": entry.id.toString(),
                "X-Unicorn-File-Type": formDefinition.type,
                Authorization: "Bearer " + token,
            },
            onError: (e) => {
                console.log("Upload failed: " + e);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const p = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
                setProgress(p);
            },
            onSuccess: () => {
                setStage(3);
                onRefresh();
            },
        });

        setStage(2);
        upload.start();
    };

    return (
        <form className="m-4">
            <label htmlFor={inputId}>
                <span className="flex flex-col items-center px-4 py-8 transition-colors bg-gray-300 dark:bg-gray-900 rounded-md cursor-pointer w-72 hover:bg-gray-200 dark:hover:bg-gray-700">
                    {stage === 1 ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-10 h-10 my-4 mt-4 text-indigo-900/75"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-gray-700 dark:text-gray-300">No file uploaded yet</p>
                            <h3 className="text-xl">
                                {formDefinition.input} ({getFileConstant(formDefinition.file).types.join(", ")})
                            </h3>
                        </>
                    ) : stage === 2 ? (
                        <>
                            <svg
                                className="mb-8 mr-3 -ml-1 text-black dark:text-gray-100 w-7 h-7 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="text-indigo-900 dark:text-indigo-500/75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="text-2xl">{progress}%</p>
                        </>
                    ) : stage === 3 ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-10 h-10 my-4 mt-4 text-indigo-900 dark:text-indigo-500/75"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3>{formDefinition.input}</h3>
                            <p className="font-light break-all">Current file: {file?.name}</p>
                            <p className="text-gray-700 dark:text-gray-400">Upload new version</p>
                        </>
                    ) : null}
                </span>
            </label>
            <input id={inputId} type="file" className="sr-only" onChange={onChange} />
        </form>
    );
};
