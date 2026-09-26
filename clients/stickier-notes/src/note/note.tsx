import { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import ReactCodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { invoke } from '@tauri-apps/api/core';

type NotePayload = {
    title: string;
    content: string;
};

const noteEditorTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#f6ff00',
    },
    styles: [],
});

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
            <div
                style={{
                    backgroundColor: 'orange',
                    padding: '6px',
                    textAlign: 'center',
                }}
            >
                {title}
            </div>
            <ReactCodeMirror
                value={content}
                onChange={setContent}
                theme={noteEditorTheme}
                style={{
                    height: '100%',
                }}
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                }}
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
