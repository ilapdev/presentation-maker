import type { Presentation } from '../types/presentation.js';
import type { Slide } from '../types/slide.js';
import  { generateId } from '../functions/generateId.js';

function createDefaultSlide(slideName: string): Slide {
    return {
        id: generateId(),
        name: slideName,
        background: { type: 'none' },
        objects: []
    };
}

function addSlide(presentation: Presentation, slideName?: string): Presentation {
    const newSlide = createDefaultSlide(
        slideName || `Слайд ${presentation.slides.length + 1}`
    );
    return {
        ...presentation,
        slides: [
                ...presentation.slides,
                newSlide
            ]
    };
}

function removeSlides(presentation: Presentation, slideId: string[]): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.filter((slide) =>
             !slideId.includes(slide.id))
    } 
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    const slideIndex = presentation.slides.findIndex((slide) => slide.id === slideId);

    if(slideIndex === -1) {
        return presentation;
    }

    const slides = [...presentation.slides];
    const removed = slides.splice(slideIndex, 1);
    const slide = removed[0];
    if(!slide) throw new Error('Slide not found')
    
    slides.splice(newIndex, 0, slide);

    return {
        ...presentation,
        slides: slides
    };
}

function duplicateSlide(presentation: Presentation, slideId: string): Presentation {
    const slide = presentation.slides.find((slide) => slide.id === slideId);

    if(!slide) return presentation;

    const newSlide: Slide = {...slide,
        id: generateId(),
        name: `Копия ${slide.name}` ,
        objects: [...slide.objects]
    };

    return {
        ...presentation,
        slides: [
            ...presentation.slides,
            newSlide
        ]
    };
}

export {
    createDefaultSlide,
    addSlide,
    removeSlides,
    moveSlide,
    duplicateSlide
};