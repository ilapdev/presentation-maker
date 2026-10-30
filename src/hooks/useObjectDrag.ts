import { useState, useRef, useEffect } from 'react';
import type { Presentation } from '../types/presentation';
import { dispatch } from '../editor';
import { moveObject } from '../functions/objects';

type DragState = {
    initialMouseX: number
    initialMouseY: number
    initialObjectsPos: Map<string, { dx: number; dy: number }>
}

export function useObjectDrag( 
    presentation: Presentation,
    activeSlideIndex: number,
    selectedObjectId: string[],
    setSelectedObjectId: React.Dispatch<React.SetStateAction<string[]>>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    onPresentationChange: (presentation: Presentation) => void) {

    const [isDragging, setIsDragging] = useState(false);  // флаг перемещаем ли мы объект прямо сейчас или нет
    const dragState = useRef<DragState | null>(null); // сохраняем данные кординат в памяти без перирисовки интрфейса

    const slides = presentation.slides ?? [];
    const slideCurrent = slides[activeSlideIndex];

    // начало перетаскивания — срабатывает при mousedown на объекте
    const handleDragMouseDown = (objectId: string, event: React.MouseEvent) => {
        event.preventDefault();

        let currentSelected = [...selectedObjectId];
        if (!currentSelected.includes(objectId)) {
            if (event.shiftKey) {
                currentSelected = [...currentSelected, objectId];
            } else {
                currentSelected = [objectId];
            }
            setSelectedObjectId(currentSelected);
        }
    
        const rectCoordinate = containerRef.current?.getBoundingClientRect();
        if (!rectCoordinate) return;

        setIsDragging(true);
        // Координаты мыши переводить в координаты слайда относительно его левого верхнего угла
        const mouseX = event.clientX - rectCoordinate.left; // event.clientX — это положение мыши относительно всего экрана. Метод getBoundingClientRect() возвращает положение холста слайда на экране. Вычитая left и top,  получаем точные координаты мыши внутри слайда
        const mouseY = event.clientY - rectCoordinate.top;

        const offsets = new Map<string, { dx: number; dy: number }>(); // Расчет смещения

        slideCurrent?.objects.forEach(object => {
            if (currentSelected.includes(object.id)) {
                offsets.set(object.id, {
                    dx: mouseX - object.x,
                    dy: mouseY - object.y
                });
            }
        });

        dragState.current = {
            initialMouseX: mouseX,
            initialMouseY: mouseY,
            initialObjectsPos: offsets 
        };
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleDragMouseMove = (event: MouseEvent) => {
            if (!dragState.current || !containerRef.current || !slideCurrent) return;

            const rectCoordinate = containerRef.current.getBoundingClientRect();
            const currentMouseX = event.clientX - rectCoordinate.left;
            const currentMouseY = event.clientY - rectCoordinate.top;

            let updatedSlide = slideCurrent;

            selectedObjectId.forEach((id) => {
                const offset = dragState.current!.initialObjectsPos.get(id);
                if (!offset) return;

                const newX = currentMouseX - offset.dx;
                const newY = currentMouseY - offset.dy;

                updatedSlide = moveObject(updatedSlide, id, newX, newY);
            });

            const updatedPresentation = dispatch(() => ({
                ...presentation,
                slides: presentation.slides.map((slide, index) => 
                    index === activeSlideIndex ? updatedSlide : slide
                )
            }));

            if (updatedPresentation) {
                onPresentationChange(updatedPresentation);
            }
        };

        const handleDragMouseUp = () => {
            setIsDragging(false); // Выключает режим перетаскивания
            dragState.current = null;
        };

        document.addEventListener('mousemove', handleDragMouseMove);
        document.addEventListener('mouseup', handleDragMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleDragMouseMove);
            document.removeEventListener('mouseup', handleDragMouseUp);
        };

    }, [isDragging, selectedObjectId, presentation, activeSlideIndex, slideCurrent, onPresentationChange, containerRef]);

    return { handleDragMouseDown, isDragging };
}