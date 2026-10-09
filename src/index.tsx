import { createRoot } from 'react-dom/client';
import { App } from './components/App/App.tsx';
import { addEditorChangeHandler, getState } from './editor.js';
import { createTestPresentation} from './data.js';
import { setInitialState } from './editor.js';

const initialData  = createTestPresentation();
setInitialState(initialData);

const root = createRoot(document.getElementById('root')!);

function renderApp(): void {
    const presentation = getState();
    if(!presentation) {
        return;
    }
    root.render(<App presentation={ presentation } />);
}

renderApp();

addEditorChangeHandler(()=> {
    renderApp();
});