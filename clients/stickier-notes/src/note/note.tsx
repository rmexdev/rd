import { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

export function Note() {
    const [title, setTitle] = useState<string>('Placeholder...');

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

    return <div>{title}</div>;
}

export default Note;
