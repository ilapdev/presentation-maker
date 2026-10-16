import styles from '../App/App.module.css';
import { useState } from 'react';
import type { Presentation } from '../../types/presentation.js';
import { setPreviewMode, getPreviewMode } from '../../editor.js';
import Toolbar from '../Toolbar/Toolbar.js';
import Workspace from '../Workspace/Workspace.js';
import SlideList from '../SlideList/SlideList.js';
import PreviewOverlay from '../PreviewOverlay/PreviewOverlay.js';
import { savePresentation, updatePresentationName } from '../../functions/presentation.js';
import { addSlide } from '../../functions/slide.js';
import { addImageObject } from '../../functions/objects.js';
import { setSlideBackgroundColor, setSlideBackgroundGradient, setSlideBackgroundImage } from '../../functions/background.js';
import type { Slide } from '..//..//types/slide.js'

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

    function openFile() {
        document.getElementById('fileInput')?.click();
    }

    function updateCurrentSlideBackground(updateBackground: (slide: Slide) => Slide) {
        setCurrentPresentation((prev) => ({
            ...prev,
            slides: prev.slides.map((slide, index) => {
                if (index === currentSlideIndex) {
                    return updateBackground(slide)
                }

                return slide
            })
        })) 
    }
    
    function handleBackgroundColorChange(color: string) {
        updateCurrentSlideBackground((slide) =>
            setSlideBackgroundColor(slide, color)
        )
    }

    function handleBackgroundGradientChange() {
        updateCurrentSlideBackground((slide) =>
            setSlideBackgroundGradient(
                slide, ['#4F8CFF', '#A855F7'], 45
            )
        )
    }

    function handleBackgroundImageChange( event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }
        const imageUrl = URL.createObjectURL(file)
        updateCurrentSlideBackground((slide) =>
            setSlideBackgroundImage(slide, imageUrl)
        )
    }

    function handleImageChange (event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const slide = currentPresentation.slides[currentSlideIndex];

            if (slide) {
                const updatedSlide = addImageObject(
                    slide,
                    imageUrl,
                    300,
                    200,
                    150,
                    100
                )

                setCurrentPresentation((prev) => ({
                    ...prev,
                    slides: prev.slides.map((item, index) =>
                        index === currentSlideIndex ? updatedSlide : item
                    )
                }))
            }
        }
    }

    const savePresentationInProject = () => {
        let result = savePresentation(currentPresentation)
        console.log(result)
    }

    if(getPreviewMode()) {
        return (
            <PreviewOverlay
                onChangeSlide={()=>{}} 
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
                    onAddImage={openFile}
                    onSave={savePresentationInProject}
                    onPreview={previewMode}
                />
                <div className={styles.main}>
                    <div className={styles.mainLeft}>
                        <SlideList 
                            onClick={setCurrentIndex}
                            presentation={currentPresentation} />
                    </div>
                    <div className={styles.mainRight}>
                        <Workspace  
                            backgroundColorChange={handleBackgroundColorChange}
                            backgroundGradientChange={handleBackgroundGradientChange}
                            backgroundImageChange={handleBackgroundImageChange}
                            activeSlideIndex={currentSlideIndex}
                            presentation={currentPresentation} />
                    </div>
                </div>
                <input 
                    type='file' id='fileInput'
                    accept='image/*' onChange={handleImageChange}
                    hidden
                />
            </div> 
        )
}

export { App }
