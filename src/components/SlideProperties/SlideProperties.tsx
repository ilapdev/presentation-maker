import styles from './SlideProperties.module.css';
import type { Background, Slide } from '../../types/slide';
import type { CSSProperties } from 'react';
import TextInput from '../TextInput/TextInput';

type SlidePropertiesProps = {
    slide: Slide
}

function getStyle(background: Background): CSSProperties {
    switch (background.type) {
        case 'solid':
            return { 
                backgroundColor: background.color 
            }
        case 'gradient':
            return {
                background: `linear-gradient(${background.angle}deg, ${background.colors.join(', ')})`
            }
        case 'image':
            return {
                backgroundImage: `url(${background.src})`,
                backgroundSize: 'cover',
            }
        default:
            return { backgroundColor: '#FFFFFF' }
    }
}

function SlideProperties({ slide }: SlidePropertiesProps) {
    return (
        <div className={styles.container}>
            <div className={styles.sectionTitle}>
                <span className={styles.title}>{slide.name}</span>
            </div>
           
            <div className={styles.section}>
                {slide.background.type === 'solid' && (
                    <>
                        <span>Color: </span>
                        <TextInput className='textPropeties' value={slide.background.color} />
                    </>
                    
                )}
                <div 
                    className={styles.preview}
                    style={getStyle(slide.background)}
                />
            </div>
        </div>
    );
}

export default SlideProperties;
