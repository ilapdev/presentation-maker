import styles from './SlideList.module.css';
import type { Presentation } from '../../types/presentation';
import SlidePreview from '../SlidePreview/SlidePreview.js';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput.js';

type SlideListProps = {
    presentation: Presentation
    onClick: (index: number) => void
    onAddSlide: () => void
    onNameChange: (name: string) => void
    activeSlideIndex: number
}

function SlideList({ 
    presentation,
    onClick,
    onAddSlide,
    onNameChange,
    activeSlideIndex
}: SlideListProps) {
    return (
        <div className={styles.container}>
            <div className={styles.titleSection}>
                <TextInput 
                    className="title"
                    value={presentation.name}
                    placeholder="Название презентации"
                    onChange={onNameChange}
                />
            </div>
            <div className={styles.addSlideSection}>
                <Button
                    item={styles.newSlideBth}
                    text="New Slide"
                    onClick={onAddSlide}
                />
                <Button
                    onClick={onAddSlide}
                    item={styles.plus}
                />
            </div>
           <div className={styles.slidesList}>
                {   
                    presentation.slides.map((slide, index) => (
                        <div key={slide.id} className={`${styles.slideItem} ${
                            index === activeSlideIndex ? styles.selected : ''
                        }`}
                        >
                            <p className={styles.slideNumber}>{index + 1}</p>

                            <div onClick={()=> onClick(index)} className={styles.slideCard}>
                                <SlidePreview  
                                    size='small' 
                                    slide={slide}  
                                    selectedObjectId={[]}
                                />
                            </div>
                        </div>
                    ))
                }
           </div>
        </div>
    )
}

export default SlideList;










