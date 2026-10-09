import { describe, it, expect } from 'vitest';
import { createPresentation } from '../functions/presentation.js';
import { addImageObject, addTextObject, updateTextObjectStyle,  moveObject, removeObject, resizeObject } from '../functions/objects.js';

/* 
    addTextObject — проверка добавления текстового объекта
    addImageObject — проверка добавления изображения
    moveObject — проверка перемещения объекта
    resizeObject — проверка изменения размера
    updateTextObjectStyle — проверка изменения стиля текста
    removeObject — проверка удаления объекта
*/

describe('addTextObject', () => {
    it('should verify adding a text object', () => {
        const presentation = createPresentation('My Presentation');
        const slide = presentation.slides[0];
        if (!slide) throw new Error('slide not found');
        const newSlide = addTextObject(
            slide,
            'My Text',
            50, 100,
            200, 300,
            'Times New Roman',
            20,
            '#000000'
        );

        expect(newSlide).not.toBe(slide);
        expect(newSlide.objects).not.toBe(slide.objects);
        expect(slide.objects.length).toBe(0);
        expect(newSlide.objects.length).toBe(1);

        const resultTextObj = newSlide.objects[0]!;
        expect(resultTextObj.type).toBe('text');

        if (resultTextObj.type === 'text') {
            expect(resultTextObj.content).toBe('My Text');          
        }

        expect(resultTextObj.x).toBe(50);
        expect(resultTextObj.y).toBe(100);
        expect(resultTextObj.width).toBe(200);
        expect(resultTextObj.height).toBe(300);
        expect(resultTextObj.id).toBeDefined();

    });
});

describe('addImageObject', () => {
    it('should verify adding an image', () => {
        const presentation = createPresentation('My Presentation');
        const slide = presentation.slides[0];
        if (!slide) throw new Error('slide not found');
        const newSlide = addImageObject(
            slide,
            'https://images.dog.ceo/breeds/affenpinscher/n02110627_12913.jpg',
            50, 50,
            200, 300
        );

        expect(newSlide).not.toBe(slide);
        expect(newSlide.objects.length).toBe(1);
        expect(slide.objects.length).toBe(0);

        const resultImageObject = newSlide.objects[0]!;
        expect(resultImageObject.type).toBe('image');
        expect(resultImageObject.x).toBe(50);
        expect(resultImageObject.y).toBe(50);
        expect(resultImageObject.width).toBe(200);
        expect(resultImageObject.height).toBe(300);
        expect(resultImageObject.id).toBeDefined();
    });
});

describe('moveObject', () => {
    it('should verify moving an object', () => {
        const presentation = createPresentation('My Presentation');
        let slide = presentation.slides[0];
        if (!slide) throw new Error('slide not found');
        slide = addTextObject(slide, 'Move me', 10, 10, 100, 100, 'Arial', 16, '#000');
        const moveId = slide.objects[0]!.id;
        const newSlide = moveObject(slide, moveId, 500, 600);
        expect(newSlide).not.toBe(slide);
        const resultMovedObj = newSlide.objects[0]!;
        expect(resultMovedObj.x).toBe(500);
        expect(resultMovedObj.y).toBe(600);

        if (resultMovedObj.type === 'text') {
            expect(resultMovedObj.content).toBe('Move me');
        }
        expect(resultMovedObj.width).toBe(100);
    });
});

describe('resizeObject', () => {
    it('should verify changing the size of an object', () => {
        const presentation = createPresentation('My Presentation');
        let slide = presentation.slides[0];

        if (!slide) throw new Error('slide not found');

        slide = addImageObject(slide, 'url', 0, 0, 100, 100);
        const resizeId = slide.objects[0]!.id;
        const newSlide = resizeObject(slide, resizeId, 300, 400);
        expect(newSlide).not.toBe(slide);

        const resultResizedObj = newSlide.objects[0]!;
        expect(resultResizedObj.width).toBe(300);
        expect(resultResizedObj.height).toBe(400);

        expect(resultResizedObj.x).toBe(0);
        expect(resultResizedObj.y).toBe(0);

    });
});

describe('updateTextObjectStyle', () => {
    it('should verify changing the text style of an object', () => {
        const presentation = createPresentation('My Presentation');
        let slide = presentation.slides[0];
        if (!slide) throw new Error('slide not found');
        slide = addTextObject(
            slide, 
            'Style', 
            0, 0, 150, 150, 
            'Times New Roman', 
            14, 
            '#FFFFFF'
        );
        
        const updateSlideId = slide.objects[0]!.id;
        const newSlide = updateTextObjectStyle(
            slide, 
            updateSlideId, 
            'Courier New', 
            20, 
            '#FF0000'
        );

        expect(newSlide).not.toBe(slide);
        const resultStyledObj = newSlide.objects[0]!;
        if (resultStyledObj.type === 'text') {
            expect(resultStyledObj.fontFamily).toBe('Courier New');
            expect(resultStyledObj.fontSize).toBe(20);
            expect(resultStyledObj.fontColor).toBe('#FF0000');
            expect(resultStyledObj.content).toBe('Style');
        }
        expect(resultStyledObj.x).toBe(0);
    });
});

describe('removeObject', () => {
    it('should verify deleting an object', () => {
        const presentation = createPresentation('My Presentation');
        let slide = presentation.slides[0];

        if (!slide) throw new Error('slide not found');

        slide = addTextObject(slide, 'Text 1', 0, 0, 100, 100, 'Arial', 16, '#000');
        slide = addTextObject(slide, 'Text 2', 200, 200, 100, 100, 'Arial', 16, '#000');

        const objToRemoveId = slide.objects[1]!.id;
        const newSlide = removeObject(slide, objToRemoveId);

        expect(newSlide).not.toBe(slide);
        expect(newSlide.objects).not.toBe(slide.objects);

        expect(newSlide.objects.length).toBe(1);
        expect(slide.objects.length).toBe(2);
        const resultRemoveObject = newSlide.objects[0]!;
        if (resultRemoveObject.type === 'text') {
            expect(resultRemoveObject.content).toBe('Text 1');
        }
    });
});








