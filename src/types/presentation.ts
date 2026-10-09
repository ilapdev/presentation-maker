import type { Slide } from "../types/slide.js";

type Presentation = {
    id: string
    name: string
    slides: Slide[]
}

export type { Presentation };