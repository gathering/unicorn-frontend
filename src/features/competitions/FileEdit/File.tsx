import React, { useEffect, useState } from 'react';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';

type FileType = 'archive' | 'music' | 'picture' | 'video';
type InputType = 'main' | 'screenshot' | 'progress1' | 'progress2' | 'progress3' | 'other';

interface IUploadFile {
    input: string;
    file: FileType;
    type: InputType;
}

interface IProps {
    onChange: (value: IUploadFile) => void;
    forceMain?: boolean;
    initialValue?: IUploadFile;
    showSave?: boolean;
    addNew?: boolean;
    onRemove?: () => void;
    disableRemove?: boolean;
}

const defaultValue = (forceMain: boolean): IUploadFile => ({
    file: 'archive',
    input: '',
    type: forceMain ? 'main' : 'screenshot',
});

export const File = ({
    initialValue,
    onChange,
    forceMain = false,
    showSave,
    addNew,
    onRemove,
    disableRemove,
}: IProps) => {
    const [value, setValue] = useState<IUploadFile>(initialValue || defaultValue(forceMain));
    const [isDirty, setIsDirty] = useState(false);

    const updateType = (type: InputType) => {
        setValue({ ...value, type });
        if (!isDirty) {
            setIsDirty(true);
        }
    };

    const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue({ ...value, input: e.target.value });
        if (!isDirty) {
            setIsDirty(true);
        }
    };

    const updateFile = (file: FileType) => {
        setValue({ ...value, file });
        if (!isDirty) {
            setIsDirty(true);
        }
    };

    const onSubmit = () => {
        // TODO Proper validation
        if (!value.input) {
            return;
        }

        onChange(value);
        setIsDirty(false);

        if (addNew) {
            setValue(defaultValue(false));
        }
    };

    return (
        <>
            <Select
                onChange={(e) => updateFile(e as FileType)}
                value={value.file}
                label="File type"
                options={[
                    { label: 'Music (wav, mp3, flac)', value: 'music' },
                    { label: 'Archive (zip, rar)', value: 'archive' },
                    { label: 'Picture (png, jpg)', value: 'picture' },
                    { label: 'Video (mov, mp4)', value: 'video' },
                ]}
            />
            <div>
                <Input label="Input name" value={value.input} onChange={updateInput} />
            </div>
            <Select
                onChange={(e) => updateType(e as InputType)}
                label="Input type"
                value={value.type}
                options={
                    forceMain
                        ? [
                              {
                                  label: 'Main entry',
                                  value: 'main',
                              },
                          ]
                        : [
                              {
                                  label: 'Screenshot',
                                  value: 'screenshot',
                              },
                              {
                                  label: 'Progress #1',
                                  value: 'progress1',
                              },
                              {
                                  label: 'Progress #2',
                                  value: 'progress2',
                              },
                              {
                                  label: 'Progress #3',
                                  value: 'progress3',
                              },
                              {
                                  label: 'Other',
                                  value: 'other',
                              },
                          ]
                }
            />

            {(isDirty || showSave) && (
                <button
                    type="button"
                    onClick={onSubmit}
                    className="flex items-center h-12 px-4 text-base text-yellow-900 duration-150 bg-yellow-300 rounded justify-evenly hover:bg-yellow-700 hover:text-black hover:shadow"
                >
                    Update
                </button>
            )}
            {!addNew && !disableRemove && (
                <button
                    type="button"
                    onClick={() => onRemove?.()}
                    className="flex items-center h-12 px-4 text-base text-red-900 duration-150 bg-red-300 rounded justify-evenly hover:bg-red-700 hover:text-black hover:shadow"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </>
    );
};
