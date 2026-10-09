import styles from './SlideList.module.css';
import type { Presentation } from '../../types/presentation';
import SlidePreview from '../SlidePreview/SlidePreview.js';

type SlideListProps = {
    presentation: Presentation
    onClick: (index: number) => void
}

function SlideList({ presentation, onClick }: SlideListProps) {
    return (
        <div className={styles.container}>
            {   
                presentation.slides.map((slide, index) => (
                    <div key={slide.id}  
                        className={styles.slideItem}
                    >
                        <p className={styles.slideNumber}>{index + 1}</p>
                        <div onClick={()=> onClick(index)} className={styles.slideCard}>
                            <SlidePreview  size='small' slide={slide} />
                        </div>
                        
                    </div>
                ))
            }
            
        </div>
    )
}

export default SlideList;










