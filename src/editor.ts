import type { Presentation } from "./types/presentation.js";

let past: Presentation[] = [];
let future: Presentation[] = [];

let currentPresentation: Presentation | null = null;
let isPreviewMode = false;

const editorChangeHandlers = new Set<() => void>();

type Modifier<P = any> = (
    model: Presentation,
    params: P
) => Presentation;

function notifyChanges(): void {
    editorChangeHandlers.forEach((handler) => handler());
}

function setInitialState(presentation: Presentation): void {
    currentPresentation = presentation;
    past = [];
    future = [];

    notifyChanges();
}

function getState(): Presentation | null {
    return currentPresentation;
}

function getHistoryState(): {
    canUndo: boolean;
    canRedo: boolean;
} {
    return {
        canUndo: past.length > 0,
        canRedo: future.length > 0,
    };
}

function dispatch(
    modifier: Modifier,
    params: any = null
): Presentation | null {
    if (!currentPresentation) {
        console.error(
            "State is not initialized! Call setInitialState first."
        );
        return null;
    }
    past = [...past, currentPresentation];
    future = [];

    currentPresentation = modifier(currentPresentation, params);

    notifyChanges();

    return currentPresentation;
}

function undo(): void {
    if (past.length === 0 || !currentPresentation) {
        return;
    }
    const prev  = past[past.length - 1];
    if(!prev) {
        return;
    }
    future = [currentPresentation, ...future];
    currentPresentation = prev;
    past = past.slice(0, -1);

    notifyChanges();
}
function redo(): void {
    if (future.length === 0 || !currentPresentation) {
        return;
    }

    const next = future[0];

    if (!next) {
        return;
    }

    past = [...past, currentPresentation];
    future = future.slice(1);
    currentPresentation = next;

    notifyChanges();
}

function getCanUndo(): boolean {
    return past.length > 0;
}

function getCanRedo(): boolean {
    return future.length > 0;
}

function addEditorChangeHandler(
    handler: () => void
): () => void {
    editorChangeHandlers.add(handler);
    return () => {
        editorChangeHandlers.delete(handler);
    };
}

function setPreviewMode(mode: boolean): void {
    isPreviewMode = mode;
    notifyChanges();
}

function getPreviewMode(): boolean {
    return isPreviewMode;
}

export {
    setInitialState,
    getState,
    getHistoryState,
    dispatch,
    undo,
    redo,
    getCanUndo,
    getCanRedo,
    addEditorChangeHandler,
    setPreviewMode,
    getPreviewMode,
};
