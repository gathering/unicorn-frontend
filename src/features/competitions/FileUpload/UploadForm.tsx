import React, { ChangeEvent, useState } from 'react';
import { useId } from '@reach/auto-id';
import * as tus from 'tus-js-client';
import { toast } from 'react-toastify';
import type { IEntry, IFile } from '../competition.types';
import { getToken } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';

const FILE_PICTURE = {
    types: ['png', 'jpg'],
};

const FILE_ARCHIVE = {
    types: ['zip', 'rar'],
};

const FILE_MUSIC = {
    types: ['mp3', 'wav'],
};

const FILE_VIDEO = {
    types: ['mp4 h264'],
};

const getFileConstant = (file: string) => {
    switch (file) {
        case 'picture':
            return FILE_PICTURE;

        case 'archive':
            return FILE_ARCHIVE;

        case 'music':
            return FILE_MUSIC;

        case 'video':
            return FILE_VIDEO;

        default:
            return null;
    }
};

interface Props {
    formDefinition: IFile;
    entry: IEntry;
    file: any;
}

export const UploadForm = ({ formDefinition, entry, file }: Props) => {
    let inputId = `unicorn-upload-input--${useId()}`;
    const [progress, setProgress] = useState('0');
    const [stage, setStage] = useState(3);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const token = getToken();

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const upload = new tus.Upload(file, {
            endpoint: import.meta.env.VITE_APP_API + '/upload/',
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            chunkSize: 15 * 1024 * 1024,
            headers: {
                'X-Unicorn-Entry-Id': entry.id.toString(),
                'X-Unicorn-File-Type': formDefinition.type,
                Authorization: 'Bearer ' + token,
            },
            onError: (e) => {
                console.log('Upload failed: ' + e);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const p = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
                setProgress(p);
            },
            onSuccess: () => {
                setStage(3);
                // if (this.props.refreshEntry) {
                //     this.props.refreshEntry();
                // }
            },
        });

        setStage(2);
        upload.start();
    };

    return (
        <form className="">
            <label htmlFor={inputId}>
                <span className="p-4 bg-blue-400 rounded-md cursor-pointer">{formDefinition.input}</span>
            </label>
            <input id={inputId} type="file" className="sr-only" onChange={onChange} />
        </form>
    );
};
