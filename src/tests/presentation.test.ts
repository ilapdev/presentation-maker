import { describe, it, expect } from 'vitest';
import { createPresentation, updatePresentationName, savePresentation, loadPresentation } from '../functions/presentation.js';
import { addSlide } from '../functions/slide.js';

/* 
    createPresentation — проверка создания презентации с правильными значениями по умолчанию
    updatePresentationName — проверка изменения названия
    savePresentation / loadPresentation — проверка сериализации/десериализации
    addSlide — проверка добавления слайда, активный слайд по умолчанию — первый
*/

describe('createPresentation', () => {
    it('should create a presentation with default slide', () => {
        const presentation = createPresentation('My Presentation');

        expect(presentation.name).toBe('My Presentation');
        expect(presentation.slides.length).toBe(1);
    });
});

describe('updatePresentation', () => {
    it('the presentation title needs to be updated', () => {
        const presentation = createPresentation('My Presentation');
        const newName = 'My new presentation';
        const updatedPresentation = updatePresentationName(presentation, newName);

        expect(updatedPresentation.name).toBe(newName);
        expect(updatedPresentation.slides.length).toBe(1);
        expect(updatedPresentation).not.toBe(presentation);
    });
});

describe('savePresentation & loadPresentation', () => {
    it('the presentation needs to be saved', () => {
        const presentation = createPresentation('My Presentation');
        const jsonString = savePresentation(presentation);
        const jsonParse = loadPresentation(jsonString);

        expect(jsonParse).not.toBe(presentation);
        expect(jsonParse).toEqual(presentation);
        expect(jsonParse.slides.length).toBe(1);
    });
});

describe('addSlide', () => {
    it('should verify that a slide is added to the presentation.', () => {
        const presentation = createPresentation('My Presentation');
        const nameSlide = "My Slide";
        const resultAddSlide = addSlide(presentation, nameSlide);

        expect(presentation.slides.length).toBe(1);
        expect(resultAddSlide).not.toBe(presentation);
        expect(resultAddSlide.slides).not.toBe(presentation.slides);
        expect(resultAddSlide.slides.length).toBe(2);
    });
});


