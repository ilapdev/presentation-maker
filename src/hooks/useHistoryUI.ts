import { useState, useEffect, useCallback } from "react";
import {
    undo,
    redo,
    getCanUndo,
    getCanRedo,
    addEditorChangeHandler,
} from "../editor.js";

type HistoryUI = {
    canUndo: boolean
    canRedo: boolean
    onUndo: () => void
    onRedo: () => void
}

export function useHistoryUI(): HistoryUI {
    const [canUndo, setCanUndo] = useState(getCanUndo());
    const [canRedo, setCanRedo] = useState(getCanRedo());

    useEffect(() => {
        const syncHistory = () => {
            setCanUndo(getCanUndo());
            setCanRedo(getCanRedo());
        };

        const unsubscribe = addEditorChangeHandler(syncHistory);
        syncHistory();

        return unsubscribe;
    }, []);

    const onUndo = useCallback(() => {
        undo();
    }, []);

    const onRedo = useCallback(() => {
        redo();
    }, []);

    return {
        canUndo,
        canRedo,
        onUndo,
        onRedo,
    };
}
