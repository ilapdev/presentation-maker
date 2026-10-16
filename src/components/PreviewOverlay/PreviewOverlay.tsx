import styles from './PreviewOverlay.module.css';
import type { Presentation } from '../../types/presentation';
import Button from '../Button/Button';
import SlidePreview from '../SlidePreview/SlidePreview';

type PreviewOverlayProps = {
    presentation: Presentation
    onClose: () => void
    activeSlideIndex: number
    onChangeSlide: (index: number) => void
}

function PreviewOverlay({ presentation, onClose, activeSlideIndex, onChangeSlide }: PreviewOverlayProps) {
    const activeSlide = presentation.slides[activeSlideIndex]
    const totalSlide = presentation.slides.length

    function goToPreviousSlide() { 
        if(activeSlideIndex > 0) {
            onChangeSlide(activeSlideIndex - 1)
        }
    }

    function goToNextSlide() { 
        if(activeSlideIndex < totalSlide - 1 ) {
            onChangeSlide(activeSlideIndex + 1)
        }
    }

    if(!activeSlide) {
        return (
            <div className="default">
                <p>Слайдов в презентации нет!</p>
            </div>
        )
    }
    return (
        <div className={styles.overlay}>
            <div className={styles.header}>
                <Button
                    className='closeElement'
                    onClick={onClose}
                />
            </div>

            <div className={styles.previewArea}>
                <SlidePreview size='large-preview' slide={activeSlide} />
            </div>

            <div className={styles.navigation}>
                <Button className='arrow-left' onClick={goToPreviousSlide} />
                <span>{activeSlideIndex + 1}  / {totalSlide}</span>
                <Button className='arrow-right' onClick={goToNextSlide} />
            </div>
        </div>
    )
}

export default PreviewOverlay;










