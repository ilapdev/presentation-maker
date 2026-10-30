import type { Presentation } from "./types/presentation.js";
import { createPresentation } from "./functions/presentation.js";
import { addSlide } from "./functions/slide.js";
import { addTextObject } from "./functions/objects.js";
import { setSlideBackgroundColor } from "./functions/background.js";

function createTestPresentation(): Presentation {
    let presentation = createPresentation('Моя тестовая презентация');

    let slideOne = presentation.slides[0]!;
    slideOne = setSlideBackgroundColor(slideOne, '#ffffff');
    slideOne = addTextObject(slideOne, 'Добро пожаловать!', 120, 50, 400, 60, 'Arial', 32, '#333333');
    slideOne = addTextObject(slideOne, 'Лабораторная работа #3', 120, 120, 400, 40, 'Arial', 20, '#666666');
    presentation.slides[0] = slideOne;
    return presentation;
}

export {
    createTestPresentation
}