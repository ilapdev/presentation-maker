import styles from '../App/App.module.css';
import { 
    useState,
    useEffect,
    useRef,
    useCallback 
} from 'react';
import { usePdfExport } from '../../hooks/usePdfExport.js';
import { useHistoryUI } from '../../hooks/useHistoryUI.js';
import { 
    setPreviewMode,
    getPreviewMode,
    getState,
    setInitialState,
    addEditorChangeHandler
} from '../../editor.js';
import { dispatch } from '../../editor'; 
import type { Presentation } from '../../types/presentation.js';
import type { Slide } from '../../types/slide.js';
import Workspace from '../Workspace/Workspace.js';
import SlidePreview from '../SlidePreview/SlidePreview.js';
import SlideList from '../SlideList/SlideList.js';
import PreviewOverlay from '../PreviewOverlay/PreviewOverlay.js';
import { savePresentation, updatePresentationName } from '../../functions/presentation.js';
import { addSlide } from '../../functions/slide.js';
import { addImageObject, addTextObject } from '../../functions/objects.js';
import { 
    clearSlideBackground,
    setSlideBackgroundColor,
    setSlideBackgroundGradient,
    setSlideBackgroundImage
} from '../../functions/background.js';

type AppProps = {
    presentation: Presentation
}

function App({ presentation }: AppProps) {
    useState(() => {
        if (!getState()) {
            setInitialState(presentation);
        }
    });

    const [editorState, setEditorState] = useState({
        presentation: getState() ?? presentation, isPreviewMode: getPreviewMode()
    });

    const {
        canUndo,
        canRedo,
        onUndo,
        onRedo
    } = useHistoryUI();

    useEffect(() => {
        const handleEditorChange = () => {
            setEditorState({
                presentation: getState() ?? presentation,
                isPreviewMode: getPreviewMode()
            });
        };
        
        addEditorChangeHandler(handleEditorChange);
    }, [presentation]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlKey = event.ctrlKey;
            if (!isCtrlKey || event.repeat) {
                return;
            }
            if (event.key.toLowerCase() === 'z') {
                event.preventDefault();
                onUndo();
            }
            if (event.key.toLowerCase() === 'y') {
                event.preventDefault();
                onRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onUndo, onRedo]);
    
    const [currentSlideIndex, setCurrentIndex] = useState(0);

    const [gradientColors, setGradientColors] = useState<string[]>(['#000000', '#FFFFFF']);
    const [gradientAngle, setGradientAngle] = useState<number>(40);

    const currentPresentation = editorState.presentation;
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const { exportToPdf, isExporting } = usePdfExport();

    const handleExportPdf = () => {
        exportToPdf(currentPresentation)
    };

    const togglePreviewMode = () => {
        setPreviewMode(!getPreviewMode());
    };

    const updateNamePresentation = (value: string) => {
        const updated = updatePresentationName(currentPresentation, value);
        dispatch(() => updated);
    };
    
    const addSlideInPresentation = () => {
        const updated = addSlide(currentPresentation);
        dispatch(() => updated);
    };

    function updateCurrentSlideBackground(updateBackground: (slide: Slide) => Slide) {
        const newPresentation = {
            ...currentPresentation,
            slides: currentPresentation.slides.map((slide, index) => {
                if (index === currentSlideIndex) {
                    return updateBackground(slide);
                }
                return slide;
            })
        };
        dispatch(() => newPresentation);
    }
    
    function handleClearBackground() {
        updateCurrentSlideBackground((slide) => clearSlideBackground(slide));
    }

    function handleBackgroundColorChange(color: string) {
        updateCurrentSlideBackground((slide) => setSlideBackgroundColor(slide, color));
    }

    function handleBackgroundGradientChange(colors: string[], angle: number) {
        updateCurrentSlideBackground((slide) =>
            setSlideBackgroundGradient(slide, colors, angle)
        )
    }

    function setGradientColor(index: 0 | 1, color: string) {
        setGradientColors((prev) => {
            const next = [...prev];
            next[index] = color;
            handleBackgroundGradientChange(next, gradientAngle);
            return next;
        })
    }     

    function handleBackgroundImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        updateCurrentSlideBackground((slide) => setSlideBackgroundImage(slide, imageUrl));
    }

    function handleGradientAngleChange(newAngle: number) {
        setGradientAngle(newAngle);
        handleBackgroundGradientChange(gradientColors, newAngle);
    }

    const openFile = useCallback(() =>{
        imageInputRef.current?.click();
    }, [])
        
    const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const baseUrl = event.target?.result as string;
                if(!baseUrl) return;

                const slide = currentPresentation.slides[currentSlideIndex];
                if (slide) {
                    const updatedSlide = addImageObject(
                        slide,
                        baseUrl,
                        200,
                        150,
                        300,
                        200
                    );

                    const newPresentation = {
                        ...currentPresentation,
                        slides: currentPresentation.slides.map((item, index) =>
                            index === currentSlideIndex ? updatedSlide : item
                        )
                    };
                    
                    dispatch(() => newPresentation)
                }
            };
            reader.readAsDataURL(file);
        }
    }, [currentPresentation, currentSlideIndex]);

    function addTextToCurrentSlide() {
        const slide = currentPresentation.slides[currentSlideIndex];
        if (!slide) return;
        
        const updatedSlide = addTextObject(
            slide,
            'Введите текст',
            100,            
            100,                
            300,                
            100,                 
            'Arial',             
            32,                 
            '#000000'
        );

        const updatedPresentation = {
            ...currentPresentation,
            slides: currentPresentation.slides.map((item, index) =>
                index === currentSlideIndex ? updatedSlide : item
            )
        };

        dispatch(() => updatedPresentation);
    }

    const savePresentationInProject = () => {
        console.log(savePresentation(currentPresentation));
        alert("Save Presentation");
    };

    if (getPreviewMode()) {
        return (
            <PreviewOverlay
                onChangeSlide={setCurrentIndex}
                activeSlideIndex={currentSlideIndex}
                presentation={currentPresentation}
                onClose={togglePreviewMode} 
            />
        );
    }
            
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.mainLeft}>
                    <SlideList
                        onAddSlide={addSlideInPresentation} 
                        onClick={setCurrentIndex}
                        presentation={currentPresentation}
                        onNameChange={updateNamePresentation}
                        activeSlideIndex={currentSlideIndex} />
                </div>
                <div className={styles.mainRight}>
                    <Workspace  
                        onAddImage={openFile}
                        backgroundColorChange={handleBackgroundColorChange}
                        backgroundImageChange={handleBackgroundImageChange}
                        activeSlideIndex={currentSlideIndex}
                        presentation={currentPresentation}
                        setGradientColor={setGradientColor} 
                        gradientColors={gradientColors}     
                        setGradientAngle={handleGradientAngleChange} 
                        onPresentationChange={((newPresentation) => {
                            dispatch(() => newPresentation)
                        })} 
                        onSave={savePresentationInProject}
                        onPreview={togglePreviewMode}
                        onClearBackground={handleClearBackground}
                        handleExportPdf={handleExportPdf} 
                        backgroundGradientChange={() => handleBackgroundGradientChange(gradientColors, gradientAngle)}
                        addTextToCurrentSlide={addTextToCurrentSlide}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onUndo={onUndo}
                        onRedo={onRedo}          
                    />
                </div>
            </div>
            <input 
                type='file'
                ref={imageInputRef}
                accept='image/*' onChange={handleImageChange}
                hidden
            />
            <div 
                id="pdf-export-hidden" 
                style={{ 
                    position: 'fixed',
                    left: '-10000px',
                    top: '0',
                    pointerEvents: 'none'
                }}
            >
            {currentPresentation.slides.map((slide) => (
                <div 
                    key={slide.id} 
                    style={{ width: '960px', height: '540px', position: 'relative' }}
                >
                    <SlidePreview 
                        size="large-export"
                        slide={slide} 
                    />
                </div>
                ))}
            </div>
        </div> 
    );
}

export { App };
