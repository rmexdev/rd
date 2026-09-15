import { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import ReactCodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

export function Note() {
    const [title, setTitle] = useState<string>('Placeholder...');
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const noteWebView = getCurrentWebviewWindow();
        const unlistenPromise = noteWebView.listen<string>(
            'update-title',
            (event) => {
                setTitle(event.payload);
            },
        );

        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, []);

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
