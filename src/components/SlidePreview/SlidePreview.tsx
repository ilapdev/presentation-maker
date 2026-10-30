import styles from './SlidePreview.module.css';
import type { Slide } from '../../types/slide';
import SlideObjectView  from '../SlideObject/SlideObject';
import getStyle from '../../functions/getStyle';
import type { SlideObject } from '../../types/objects';
import { forwardRef } from 'react';

type SlidePreviewProps = {
    slide: Slide
    size?: string
    selectedObjectId?: string[]
    onObjectClick?: (objectId: string, shiftKey: boolean) => void
    onEmptyFonClick?: () => void
    onObjectMouseDown?: (id: string, event: React.MouseEvent) => void
    onObjectResizeMouseDown?: (
        object: SlideObject,
        event: React.MouseEvent<HTMLDivElement>
    ) => void
    onTextChange?: (objectId: string, content: string) => void;
    readOnly?: boolean
}

const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(({ 
    slide,
    size,
    selectedObjectId,
    onObjectClick,
    onEmptyFonClick,
    onObjectMouseDown,
    onObjectResizeMouseDown,
    onTextChange,
    readOnly = false,
}, ref) => {
    function renderObjects() {
        return slide.objects.map((object: SlideObject) => (
            <SlideObjectView
                object={object}
                key={object.id}
                onMouseDown={(event) => onObjectMouseDown?.(object.id, event)}
                selected={(selectedObjectId ?? []).includes(object.id)}
                onChange={(content) => onTextChange?.(object.id, content)}
                onClick={(event) => {
                    event.stopPropagation();
                    onObjectClick?.(object.id, event.shiftKey);
                }}
                onResizeMouseDown={(event, object) =>
                    onObjectResizeMouseDown?.(object, event)
                }
                readOnly={readOnly}
            />
        ));
    }

    if(size === 'small') {
        return(
            <div className={styles.small} style={getStyle(slide.background)}>
                <div className={styles.scaleBox}>
                    {slide.objects.map((object) => (
                        <SlideObjectView
                            readOnly={true}
                            object={object}
                            key={object.id} 
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles[size ?? 'large']}
            ref={ref} 
            onClick={onEmptyFonClick}
            style={
                getStyle(slide.background)
            }>
            { renderObjects() }
        </div>
   );
});

export default SlidePreview;










