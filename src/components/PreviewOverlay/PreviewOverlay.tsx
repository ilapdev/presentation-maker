import styles from './PreviewOverlay.module.css';
import type { Presentation } from '../../types/presentation';
import Button from '../Button/Button';
import SlidePreview from '../SlidePreview/SlidePreview';

type PreviewOverlayProps = {
    presentation: Presentation
    onClose: () => void
    activeSlideIndex: number
}

function PreviewOverlay({ presentation, onClose, activeSlideIndex }: PreviewOverlayProps) {
    const activeSlide = presentation.slides[activeSlideIndex]
    const totalSlide = presentation.slides.length
    if(!activeSlide) {
        return (
            <div className="default">
                <p>Слайдов в презентации нет!</p>
            </div>
        );
    }
    return (
        <div className={styles.overlay}>
            <div className={styles.header}>
                <Button
                    className='closeElement'
                    text="Preview"
                    onClick={onClose}
                />
            </div>

            <div className={styles.previewArea}>
                <SlidePreview size='large' slide={activeSlide} />
            </div>

            <div className={styles.navigation}>
                <Button text="Назад" className='arrow' onClick={() => {}} />
                <span>{activeSlide.name}  / {totalSlide}</span>
                <Button className='arrow' text="Далее" onClick={() => {}} />
            </div>
        </div>
    );
}

export default PreviewOverlay;










