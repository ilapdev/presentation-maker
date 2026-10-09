import type { Presentation } from '../types/presentation.js';
import type { Slide } from "../types/slide.js";
import  { generateId } from '../functions/generateId.js';


function createDefaultSlide(): Slide {
    return {
        id: generateId(),
        name: 'Слайд 1',
        background: { type: 'solid', color: '#FFFFFF' },
        objects: []
    };
}

function createPresentation(name: string): Presentation {
    const defaultSlide = createDefaultSlide();
    return {
        id: generateId(),
        name: name,
        slides: [defaultSlide]
    };
}

function updatePresentationName(presentation: Presentation, name: string): Presentation  {
    return {
        ...presentation,  
        name: name,
    };
}

function savePresentation(presentation: Presentation): string {
    let result =  JSON.stringify(presentation, null, 2);
    return result;
}

function loadPresentation(json: string): Presentation {
    return JSON.parse(json) as Presentation;
}

export {
    createPresentation,
    updatePresentationName,
    savePresentation,
    loadPresentation
};