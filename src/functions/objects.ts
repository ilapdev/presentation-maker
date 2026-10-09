import type { Slide } from '../types/slide.js';
import type { TextObject, ImageObject } from '../types/objects.js';
import  { generateId } from '../functions/generateId.js';

function addTextObject(slide: Slide, content: string, x: number, y: number, width: number, height: number, fontFamily: string, fontSize: number, fontColor: string): Slide {
    const objectText: TextObject = {
        id: generateId(),
        type: 'text',
        content: content,
        x: x, y: y,
        width: width,
        height: height,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontColor: fontColor
    }
    
    return {
        ...slide,
        objects: [...slide.objects, objectText]
    };
}

function addImageObject(slide: Slide, imageUrl: string, x: number, y: number, width: number, height: number): Slide {
    const objectImage: ImageObject = {
        id: generateId(),
        type: 'image',
        imageUrl: imageUrl,
        x: x,
        y: y,
        width: width,
        height: height
    }
    return {
        ...slide,
        objects: [...slide.objects, objectImage]
    };
}

function removeObject(slide: Slide, id: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter((object) => object.id !== id)
    }
}

function moveObject(slide: Slide, id: string, newX: number, newY: number): Slide {
    return {
        ...slide,
        objects: slide.objects.map((object) => {
            if(object.id === id) {
                return {
                    ...object,
                    x: newX,
                    y: newY
                };
            }
            return object;
        })
    }
}

function resizeObject(slide: Slide, id: string, newWidth: number, newHeight: number): Slide {
    return {
        ...slide,
        objects: slide.objects.map((object) => {
            if(object.id === id) {
                return {
                    ...object,
                    width: newWidth,
                    height: newHeight
                };
            }
            return object;
        })
    }
}

function updateTextObjectStyle(slide: Slide, id: string, fontFamily: string, fontSize: number, fontColor: string): Slide {
    return {
        ...slide,
        objects: slide.objects.map((object) => {
            if(object.id === id && object.type === 'text') {
                return {
                    ...object,
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    fontColor: fontColor
                };
            }
            return object;
        })
    }
}

export {
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
};
