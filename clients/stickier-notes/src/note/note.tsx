import { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import ReactCodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { invoke } from '@tauri-apps/api/core';

type NotePayload = {
    title: string;
    content: string;
};

export function Note() {
    const [title, setTitle] = useState<string>('Placeholder...');
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const noteWebView = getCurrentWebviewWindow();
        const unlistenOpenPromise = noteWebView.listen<NotePayload>(
            'note-open',
            (event) => {
                setTitle(event.payload.title);
                setContent(event.payload.content);
            },
        );

        return () => {
            unlistenOpenPromise.then((unlisten) => unlisten());
        };
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (content.length > 0) {
                invoke('save_note_content', { content });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [content]);

    return (
        <>
            <div>{title}</div>
            <ReactCodeMirror
                value={content}
                onChange={setContent}
                autoFocus
                extensions={[
                    markdown({
                        base: markdownLanguage,
                    }),
                ]}
            />
        </>
    );
}

export default Note;
