import { describe, it, expect } from 'vitest';
import { createPresentation} from '../functions/presentation.js';
import { addSlide, moveSlide, removeSlides,  } from '../functions/slide.js';
import { setSlideBackgroundColor, clearSlideBackground } from '../functions/background.js';

/* 
    removeSlides — проверка удаления одного и нескольких слайдов
    moveSlide — проверка перемещения в начало, конец, середину
    setSlideBackgroundColor — проверка установки цвета фона
    clearSlideBackground — проверка сброса фона
*/

describe('removeSlides', () => {
    it('should verify deletion of one or more slides', () => {
        const presentation = createPresentation('My Presentation');

        if (!presentation.slides[0]) throw new Error('slide not found');

        const slideRemoveId =  presentation.slides[0].id;
        const deleteSlide = removeSlides(presentation, [slideRemoveId] )
        expect(deleteSlide).not.toBe(presentation);
        expect(deleteSlide.slides.length).toBe(0);
        expect(presentation.slides.length).toBe(1);
    });
});

describe('moveSlide', () => {
    it('should verify moving a slide to the beginning', () => {
        let presentation = createPresentation('My Presentation');
        presentation = addSlide(presentation, 'My slide 1');
        presentation = addSlide(presentation, 'My slide 2');

        if (!presentation.slides[2]) throw new Error('slide not found'); 
        const slideMovedId = presentation.slides[2].id;;
        const resultMoveSlide = moveSlide(presentation, slideMovedId, 0)

        expect(resultMoveSlide).not.toBe(presentation);
        expect(resultMoveSlide.slides.length).toBe(3);
   
        expect(resultMoveSlide.slides[0]!.name).toBe('My slide 2');
        expect(resultMoveSlide.slides[1]!.name).toBe('Слайд 1');
        expect(resultMoveSlide.slides[2]!.name).toBe('My slide 1');

        expect(presentation.slides[0]!.name).toBe('Слайд 1');
        expect(presentation.slides[2]!.name).toBe('My slide 2');

    });

    it('should verify moving a slide to the middle', () => {
        let presentation = createPresentation('My Presentation');
        presentation = addSlide(presentation, 'My slide 1');
        presentation = addSlide(presentation, 'My slide 2');

        if (!presentation.slides[0]) throw new Error('slide not found'); 
        const slideMovedId = presentation.slides[0].id;
        const resultMoveSlide = moveSlide(presentation, slideMovedId, 1)

        expect(resultMoveSlide).not.toBe(presentation);
        expect(resultMoveSlide.slides.length).toBe(3);
     
        expect(resultMoveSlide.slides[0]!.name).toBe('My slide 1');
        expect(resultMoveSlide.slides[1]!.name).toBe('Слайд 1');
        expect(resultMoveSlide.slides[2]!.name).toBe('My slide 2');

    });
    
    it('should verify moving a slide to the end', () => {
        let presentation = createPresentation('My Presentation');
        presentation = addSlide(presentation, 'My slide 1');
        presentation = addSlide(presentation, 'My slide 2');

        if (!presentation.slides[0]) throw new Error('slide not found'); 
        const slideMovedId = presentation.slides[0].id;
        const resultMoveSlide = moveSlide(presentation, slideMovedId, 2)

        expect(resultMoveSlide).not.toBe(presentation);
        expect(resultMoveSlide.slides.length).toBe(3);
     
        expect(resultMoveSlide.slides[0]!.name).toBe('My slide 1');
        expect(resultMoveSlide.slides[1]!.name).toBe('My slide 2');
        expect(resultMoveSlide.slides[2]!.name).toBe('Слайд 1');

    });
});

describe('setSlideBackgroundColor', () => {
    it('should verify setting the slide background color', () => {
        const presentation = createPresentation('My Presentation');
        const slide =  presentation.slides[0];
        if (!slide) throw new Error('slide not found');
        const color = '#7AA3FB';
        
        const resultBackColor = setSlideBackgroundColor(slide, color)
        expect(resultBackColor).not.toBe(slide);
        expect(resultBackColor.background.type).toBe('solid');
        if (resultBackColor.background.type === 'solid') {
            expect(resultBackColor.background.color).toBe('#7AA3FB');
        }
    });
});

describe('clearSlideBackground', () => {
    it('should verify resetting the slide background', () => {
        const presentation = createPresentation('My Presentation');
        const slide =  presentation.slides[0];
        if (!slide) throw new Error('slide not found'); 

        const colorSlide = setSlideBackgroundColor(slide, '#7AA3FB');
        
        const resultBackColor = clearSlideBackground(colorSlide);
        expect(resultBackColor).not.toBe(colorSlide);
        expect(resultBackColor.background.type).toBe('none');
    });
});





