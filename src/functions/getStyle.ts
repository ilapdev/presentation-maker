import type { CSSProperties } from 'react';
import type { Background } from '../types/slide'

function getStyle(background: Background): CSSProperties {
    switch (background.type) {
        case 'solid':
            return { 
                backgroundColor: background.color
            };
        case 'gradient':
            return {
                background: `linear-gradient(${background.colors.join(', ')})`
            };
        case 'image':
            return {
                backgroundImage: `url(${background.src})`
            };
        default:
            return {backgroundColor: '#FFFFFF'};
    }
}

export default getStyle;