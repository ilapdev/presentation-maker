import styles from './SlideObject.module.css';
import type { SlideObject  } from '../../types/objects';
import type { CSSProperties } from 'react';
import TextInput from '../TextInput/TextInput';

type SlideObjectProps = {
    object: SlideObject
    onChange?: (value: string) => void
}

function SlideObjectView({ object, onChange }: SlideObjectProps) {
    if(object.type === "text") {
        
        const inputStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${object.x}px`,
            top: `${object.y}px`,
            width: `${object.width}px`,
            height: `${object.height}px`,
            fontFamily: object.fontFamily,
            fontSize: `${object.fontSize}px`,
            color: object.fontColor
        }

        return (
            <TextInput
                className='inputObj'
                value={object.content ?? ' '}
                onChange={onChange}
                stylesCSS = {inputStyle}  />
        );
    }

    if(object.type === "image") {
        const imageStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${object.x}px`,
            top: `${object.y}px`,
            width: `${object.width}px`,
            height: `${object.height}px`,
            objectFit: 'cover'
        };
        return (
            <img className={styles.imageObject}
                style={imageStyle}
                src={object.imageUrl}
                alt="image"      
            />
        );
    }
}

export default SlideObjectView;










