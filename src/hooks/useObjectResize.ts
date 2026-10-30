import { useState, 
    useRef, 
    useEffect, 
    useCallback 
} from 'react';
import type { SlideObject } from '../types/objects';
import { dispatch } from '../editor';
import { resizeObject } from '../functions/objects';
import type { Presentation } from '../types/presentation';

type ResizeState = {
    objectId: string
    startMouseX: number
    startMouseY: number
    startWidth: number
    startHeight: number
}
 
export function useObjectResize( 
    activeSlideIndex: number,
    onPresentationChange: (presentation: Presentation) => void
) {
    const [isResizing, setIsResizing] = useState(false);
    const resizeState = useRef<ResizeState | null>(null);

    const handleResizeMouseDown = (
        object: SlideObject,
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        resizeState.current = {
            objectId: object.id,
            startMouseX: event.clientX,
            startMouseY: event.clientY,
            startWidth: object.width,
            startHeight: object.height
        };

        setIsResizing(true);
    };

    const handleResizeMouseMove = useCallback((event: MouseEvent) => {
        const state = resizeState.current;
        if (!state) return;

        const deltaX = event.clientX - state.startMouseX;
        const deltaY = event.clientY - state.startMouseY;

        const newWidth = Math.max(30, state.startWidth + deltaX);
        const newHeight = Math.max(30, state.startHeight + deltaY);

        const updatedPresentation = dispatch(
            (model) => ({
                ...model,
                slides: model.slides.map((slide, index) => {
                    if (index !== activeSlideIndex) return slide;
                    return resizeObject(
                        slide,
                        state.objectId,
                        newWidth,
                        newHeight
                    );
                })
            })
        );

        if (updatedPresentation) {
            onPresentationChange(updatedPresentation); 
        }
    }, [activeSlideIndex, onPresentationChange]); 

    const handleResizeMouseUp = useCallback(() => {
        resizeState.current = null;
        setIsResizing(false); 
    }, []);

    useEffect(() => {
        if (!isResizing) return;
        
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleResizeMouseMove);
            document.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

    return { 
        handleResizeMouseDown, 
        isResizing 
    }
}