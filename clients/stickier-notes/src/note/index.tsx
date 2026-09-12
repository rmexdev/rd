import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Note from './note.tsx';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    <StrictMode>
        <Note />
    </StrictMode>,
);
