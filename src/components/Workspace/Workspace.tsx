import styles from './Workspace.module.css';
import { useEffect, useState, useRef } from 'react';
import type { Presentation } from '../../types/presentation';
import SlidePreview from '../SlidePreview/SlidePreview';
import SlideProperties from '../SlideProperties/SlideProperties';
import ToolbarModal from '../ToolbarModal/ToolbarModal';
import { removeObject } from '../../functions/objects';
import { dispatch } from '../../editor';
import { useObjectResize } from '../../hooks/useObjectResize';
import { useObjectDrag } from '../../hooks/useObjectDrag';
import { updateTextObjectContent } from '../../functions/objects';

type WorkspaceProps = {
    presentation: Presentation
    activeSlideIndex: number
    backgroundColorChange: (color: string) => void
    backgroundImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    setGradientColor: (index: 0 | 1, color: string) => void
    gradientColors: string[]
    setGradientAngle: (angle: number) => void 
    onPresentationChange: (presentation: Presentation) => void
    onAddImage: () => void
    onSave: () => void
    onPreview: () => void
    onClearBackground: () => void
    handleExportPdf: () => void
    backgroundGradientChange: () => void
    addTextToCurrentSlide: () => void
    canUndo: boolean
    canRedo: boolean
    onUndo: () => void
    onRedo: () => void
}

function Workspace({
    presentation,
    activeSlideIndex,
    backgroundImageChange,
    backgroundColorChange,
    onPresentationChange,
    setGradientColor,
    gradientColors,
    setGradientAngle,
    onAddImage,
    onSave,
    onPreview,
    onClearBackground,
    handleExportPdf,
    backgroundGradientChange,
    addTextToCurrentSlide,
    canUndo, canRedo,
    onUndo, onRedo
}: WorkspaceProps) {
    // Состояние выделенных объектов хранить в useState<string[]> внутри компонента рабочей области
    const [selectedObjectId, setSelectedObjectId] = useState<string[]>([]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const slides = presentation.slides ?? [];
    const slideCurrent = slides[activeSlideIndex];

    const { handleResizeMouseDown } = useObjectResize(
        activeSlideIndex, onPresentationChange
    );

    const { handleDragMouseDown } = useObjectDrag(
        presentation,
        activeSlideIndex,
        selectedObjectId,
        setSelectedObjectId,
        containerRef,
        onPresentationChange
    );

    useEffect(() => {
        setSelectedObjectId([]);
    }, [activeSlideIndex]);

    // Удаление по клавише Delete — при нажатии Delete или Backspace удаляются все выделенные объекты
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Delete' && event.key !== 'Backspace') return;
            const target = event.target;
            if (target instanceof HTMLInputElement 
                || target instanceof HTMLTextAreaElement 
                || (target instanceof HTMLElement && target.isContentEditable)) return;
            if (selectedObjectId.length === 0) return;
            event.preventDefault();
            removeSelectedObjects();
        }
        
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedObjectId, activeSlideIndex, presentation]);

    // Обработку кликов реализовать через onClick на каждом объекте 
    // Одиночное выделение — при клике на объект на слайде он выделяется
    // Множественное выделение — при зажатом Shift + клик добавляет/убирает объект из выделения
    const handleObjectClick = (objectId: string, shiftKey: boolean) => {
        setSelectedObjectId((prevent) => {
            if (shiftKey) {
                const result = prevent.includes(objectId) ? prevent.filter((id) => id !== objectId) : [...prevent, objectId];
                return result
            }
            return [objectId];
        });
    };
    // Клик на пустое место снимает выделение
    const handleEmptyFonClick = () => {
        setSelectedObjectId([])
    };

    const removeSelectedObjects = () => {
        if (selectedObjectId.length === 0) return;
        const updatedPresentation = dispatch(
            (model, params: { slideIndex: number; objectIds: string[] }) => ({
                ...model,
                slides: model.slides.map((slide, index) => {
                    if (index !== params.slideIndex) 
                        return slide;
                    return params.objectIds.reduce((upd, id) => removeObject(upd, id), slide);
                })
            }),
            { slideIndex: activeSlideIndex, objectIds: selectedObjectId }
        );
        
        if (updatedPresentation) {
            onPresentationChange(updatedPresentation);
        }

        setSelectedObjectId([]);
    };

    function handleTextChange(objectId: string, content: string) {
        const updatedPresentation = dispatch(
            (model, params: {
                slideIndex: number;
                objectId: string;
                content: string;
            }) => ({
                ...model,
                slides: model.slides.map((slide, index) => {
                    if (index !== params.slideIndex) {
                        return slide;
                    }
                    return updateTextObjectContent(
                        slide,
                        params.objectId,
                        params.content
                    );
                })
            }),
            {
                slideIndex: activeSlideIndex,
                objectId,
                content
            }
        );
        if (updatedPresentation) {
            onPresentationChange(updatedPresentation);
        }
    }

    if (!slideCurrent) return null;
    return (
        <div  className={styles.container}>
            <div className={styles.containerMain}> 
                <SlidePreview
                    ref={containerRef}
                    size='large'
                    slide={slideCurrent}
                    selectedObjectId={selectedObjectId}
                    onObjectClick={handleObjectClick}
                    onEmptyFonClick={handleEmptyFonClick}
                    onObjectMouseDown={handleDragMouseDown} 
                    onObjectResizeMouseDown={handleResizeMouseDown} 
                    onTextChange={handleTextChange}
                />
                <ToolbarModal 
                    onSavePdf={handleExportPdf}
                    onAddImage={onAddImage}
                    addTextToCurrentSlide={addTextToCurrentSlide}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={onUndo}
                    onRedo={onRedo} />
            </div>
            <div className={styles.containerTools}>
                <SlideProperties 
                    backgroundColorChange={backgroundColorChange}
                    backgroundImageChange={backgroundImageChange}  
                    slide={slideCurrent}
                    setGradientColor={setGradientColor}
                    gradientColors={gradientColors}
                    activeSlideIndex={activeSlideIndex}
                    selectedObjectIds={selectedObjectId}
                    onPresentationChange={onPresentationChange}
                    setGradientAngle={setGradientAngle}
                    backgroundGradientChange={backgroundGradientChange}
                    onSave={onSave}
                    onPreview={onPreview}
                    onClearBackground={onClearBackground}         
                />
            </div>
        </div>
    );
}

export default Workspace;
