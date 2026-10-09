import type { Presentation } from "./types/presentation.js";
import { createPresentation } from "./functions/presentation.js";
import { addSlide } from "./functions/slide.js";
import { addTextObject } from "./functions/objects.js";
import { setSlideBackgroundColor } from "./functions/background.js";

function createTestPresentation(): Presentation {
    let presentation = createPresentation('Моя тестовая презентация');

    let slideOne = presentation.slides[0]!;
    slideOne = setSlideBackgroundColor(slideOne, '#ffffff');
    slideOne = addTextObject(slideOne, 'Добро пожаловать!', 50, 50, 400, 60, 'Arial', 32, '#333333');
    slideOne = addTextObject(slideOne, 'Лабораторная работа #2', 50, 120, 400, 40, 'Arial', 20, '#666666');
    presentation.slides[0] = slideOne;


    presentation = addSlide(presentation, 'Список');
    let slideTwo = presentation.slides[1]!;

    slideTwo = setSlideBackgroundColor(slideTwo, '#ffffff' );
    slideTwo = addTextObject(slideTwo, 'Список задач:', 50, 50, 300, 40, 'Arial', 24, '#000000');
    slideTwo = addTextObject(slideTwo, '1. Разработать интерфейс', 50, 100, 350, 30, 'Arial', 18, '#333333');
    slideTwo = addTextObject(slideTwo, '2. Добавить интерактивность', 50, 140, 350, 30, 'Arial', 18, '#333333');
    slideTwo = addTextObject(slideTwo, '3. Выделить общие компоненты', 50, 180, 350, 30, 'Arial', 18, '#333333');
    presentation.slides[1] = slideTwo;    


    presentation = addSlide(presentation, 'Итоги');
    let slideThree = presentation.slides[2]!;
    slideThree = setSlideBackgroundColor(slideThree, '#e8f5e9');
    slideThree = addTextObject(slideThree, 'Итоги работы:', 50, 50, 300, 40, 'Arial', 24, '#2e7d32');
    slideThree = addTextObject(slideThree, 'Готово!', 50, 180, 200, 60, 'Arial', 36, '#4caf50');
    presentation.slides[2] = slideThree; 
    
    return presentation;
}

export {
    createTestPresentation
}