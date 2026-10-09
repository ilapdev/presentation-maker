import type { Slide } from '../types/slide.js';

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    return {
        ...slide,
        background: { type: 'solid', color }
    };
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide {
    return {
        ...slide,
        background: { type: 'image', src: imageUrl }
    };
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle?: number): Slide {
    return {
        ...slide,
        background: { 
            type: 'gradient',
            colors: colors, 
            angle: angle ?? 0
        }
    };
}

function clearSlideBackground(slide: Slide): Slide {
    return {
        ...slide,
        background: { type: 'none' }
    };
}

export {
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
};


