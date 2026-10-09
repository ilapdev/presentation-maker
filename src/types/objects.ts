type TextObject = FontBase & BaseObject & {
    type: 'text'
    content?: string
}

type ImageObject = BaseObject & {
    type: 'image'
    imageUrl: string
}

type FontBase = {
    fontFamily?: string
    fontSize?: number
    fontColor?: string
}

type BaseObject = {
    id: string
    x: number 
    y: number
    height: number
    width: number
}

type SlideObject = TextObject | ImageObject

export type { TextObject, ImageObject, SlideObject };


