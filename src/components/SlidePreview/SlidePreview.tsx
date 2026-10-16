import styles from './SlidePreview.module.css';
import type { Slide } from '../../types/slide';
import SlideObjectView  from '../SlideObject/SlideObject';
import getStyle from '../../functions/getStyle';

type SlidePreviewProps = {
    slide: Slide
    size?: string
}

function SlidePreview({ slide, size }: SlidePreviewProps) {
    if(size === 'small') {
        return(
            <div className={styles.small} style={getStyle(slide.background)}>
                <div className={styles.scaleBox}>
                    {slide.objects.map((object) => (
                        <SlideObjectView object={object} key={object.id} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles[size!]} style={
                getStyle(slide.background)
            }>
            {  
                slide.objects.map((object) => (
                    <SlideObjectView  object={object} key={object.id} />
                ))
            }
        </div>
    );
}

export default SlidePreview;










