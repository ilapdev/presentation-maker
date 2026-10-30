import styles from './PreviewOverlay.module.css';
import type { Presentation } from '../../types/presentation';
import Button from '../Button/Button';
import SlidePreview from '../SlidePreview/SlidePreview';
import { useEffect, useState } from 'react';

type PreviewOverlayProps = {
    presentation: Presentation
    onClose: () => void
    activeSlideIndex: number
    onChangeSlide: (index: number) => void
}

function PreviewOverlay({
    presentation,
    onClose,
    activeSlideIndex,
    onChangeSlide
}: PreviewOverlayProps) {
    const activeSlide = presentation.slides[activeSlideIndex];
    const totalSlides = presentation.slides.length;

    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const SLIDE_WIDTH = 960;
            const SLIDE_HEIGHT = 540;

            const scaleX = window.innerWidth / SLIDE_WIDTH;
            const scaleY = window.innerHeight / SLIDE_HEIGHT;

            setScale(Math.min(scaleX, scaleY));
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') goToPreviousSlide();
            if (event.key === 'ArrowRight') goToNextSlide();
            if (event.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeSlideIndex, totalSlides, onClose]);

    function goToPreviousSlide() {
        if (activeSlideIndex > 0) onChangeSlide(activeSlideIndex - 1)
    }

    function goToNextSlide() {
        if (activeSlideIndex < totalSlides - 1) onChangeSlide(activeSlideIndex + 1)
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
            <div className={styles.slideContainer}>
                <div className={styles.previewArea} style={{ transform: `scale(${scale})` }} >
                    <Button 
                        item={styles.closeIcon} 
                        onClick={onClose} 
                    />
                    <SlidePreview 
                        size='large-preview'
                        readOnly={true} 
                        slide={activeSlide} 
                        selectedObjectId={[]} 
                    />
                    <Button 
                        item={styles.arrowLeft}
                        onClick={goToPreviousSlide} 
                    />
                    <Button 
                        item={styles.arrowRight}
                        onClick={goToNextSlide} 
                    />
                    <div className={styles.counter}>
                        {activeSlideIndex + 1} / {totalSlides}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewOverlay;










