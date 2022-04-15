import React, { useEffect, useState } from 'react';
import { useId } from '@reach/auto-id';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, convertToRaw, EditorState, RawDraftContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface IProps {
    label: string;
    errorLabel?: string;
    defaultState?: RawDraftContentState;
    onChange?: (editorState: RawDraftContentState) => void;
}

export const Wysiwyg = ({ label, errorLabel, defaultState, onChange }: IProps) => {
    let errorLabelId = `unicorn-wysiwyg-errorlabel--${useId()}`;
    const [editorState, setEditorState] = useState(
        defaultState ? EditorState.createWithContent(convertFromRaw(defaultState)) : EditorState.createEmpty()
    );

    const onEditorStateChange = (editorStateChange: EditorState) => {
        setEditorState(editorStateChange);

        onChange?.(convertToRaw(editorStateChange.getCurrentContent()));
    };

    return (
        <>
            <label className="dark:text-gray-100">{label}</label>
            {errorLabel && (
                <label role="alert" className="text-red-600 dark:text-red-400" id={errorLabelId}>
                    {errorLabel}
                </label>
            )}
            <Editor
                ariaLabel="Competition description"
                ariaDescribedBy={errorLabel ? errorLabelId : undefined}
                onEditorStateChange={onEditorStateChange}
                editorState={editorState}
                wrapperClassName="block mb-6 leading-tight text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 rounded shadow focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-gray-500"
                toolbarClassName="rounded-t dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                editorClassName="p-4"
                toolbar={{
                    options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'history'],
                    blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    image: {
                        uploadEnabled: false,
                    },
                }}
            />
        </>
    );
};
