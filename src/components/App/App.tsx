import styles from '../App/App.module.css';
import type { Presentation } from '../../types/presentation.js';
import { setPreviewMode, getPreviewMode } from '../../editor.js';
import Toolbar from '../Toolbar/Toolbar.js';
import Workspace from '../Workspace/Workspace.js';
import SlideList from '../SlideList/SlideList.js';
import PreviewOverlay from '../PreviewOverlay/PreviewOverlay.js';
import { savePresentation, updatePresentationName } from '../../functions/presentation.js';
import { addSlide } from '../../functions/slide.js';
import { addImageObject } from '../../functions/objects.js';
import { useState } from 'react';

type AppProps = {
    presentation: Presentation
}

const previewMode = () => {
    const mode = getPreviewMode()
    setPreviewMode(!mode)
}

function App({ presentation }: AppProps) {

    const [currentPresentation, setCurrentPresentation] = useState(presentation);
    const [currentSlideIndex, setCurrentIndex] = useState(0);

    const updateNamePresentation = (value: string) => {
        let name = updatePresentationName(currentPresentation, value);
        setCurrentPresentation(name)
    }
    
    const addSlideInPresentation = () => {
        let updatePresentation = addSlide(currentPresentation, "Слайд new");
        setCurrentPresentation(updatePresentation)
    }

    const addImageInSlide = () => {
        let slide = currentPresentation.slides[currentSlideIndex];
        if(slide) {
            const updatedSlide = addImageObject(slide, "https://habrastorage.org/getpro/habr/upload_files/d4f/a46/db5/d4fa46db5c8dd0bdf0457900653dc1c7.jpeg", 300, 200, 150, 50)

            setCurrentPresentation((prev) => ({
                ...prev,
                slides: prev.slides.map((slide, index) => 
                    index === currentSlideIndex ? updatedSlide : slide
                )
             }));       
        }
    }

    const savePresentationInProject = () => {
        let result = savePresentation(currentPresentation)
        console.log(result)
    }

    if(getPreviewMode()) {
        return (
            <PreviewOverlay 
                activeSlideIndex={currentSlideIndex}
                presentation={currentPresentation}
                onClose={()=> setPreviewMode(false)} 
            />
        )}
            
        return (
            <div className={styles.container}>
                <Toolbar 
                    presentation={currentPresentation}
                    onNameChange={updateNamePresentation}
                    onAddSlide={addSlideInPresentation}
                    onAddImage={addImageInSlide}
                    onSave={savePresentationInProject}
                    onPreview={previewMode}
                />
                <div className={styles.main}>
                    <div className={styles.mainLeft}>
                        <SlideList onClick={setCurrentIndex} presentation={currentPresentation} />
                    </div>
                    <div className={styles.mainRight}>
                        <Workspace activeSlideIndex={currentSlideIndex} presentation={currentPresentation} />
                    </div>
                </div>
            </div> 
        )
}

export { App } 