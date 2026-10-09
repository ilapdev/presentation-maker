import type { SlideObject } from "../types/objects.js";

type ImageBackground = {
    type: "image"
    src: string
}

type ColorBackground = {
    type: 'solid'
    color: string
}

type GradientBackground = {
    type: 'gradient'
    colors: string[]
    angle: number
}

type NoneBackground = {
    type: 'none'
}

type Background = 
    ImageBackground |
    ColorBackground |
    GradientBackground |
    NoneBackground

type Slide = {
    id: string
    name: string
    background: Background
    objects: SlideObject[]
}


export type { Slide, Background };