import React, { useEffect, useState } from 'react';
import { useId } from '@reach/auto-id';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, RawDraftContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface IProps {
    label: string;
    errorLabel?: string;
    defaultState?: EditorState;
    onChange?: (editorState: RawDraftContentState) => void;
}

export const Wysiwyg = ({ label, errorLabel, defaultState, onChange }: IProps) => {
    let errorLabelId = `unicorn-wysiwyg-errorlabel--${useId()}`;
    const [editorState, setEditorState] = useState(defaultState || EditorState.createEmpty());

    const onEditorStateChange = (editorStateChange: EditorState) => {
        setEditorState(editorStateChange);

        onChange?.(convertToRaw(editorStateChange.getCurrentContent()));
    };

    return (
        <>
            <label>{label}</label>
            {errorLabel && (
                <label role="alert" className="text-red-600" id={errorLabelId}>
                    {errorLabel}
                </label>
            )}
            <Editor
                ariaLabel="Competition description"
                ariaDescribedBy={errorLabel ? errorLabelId : undefined}
                onEditorStateChange={onEditorStateChange}
                editorState={editorState}
                wrapperClassName="block mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500"
                toolbarClassName="rounded-t"
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
