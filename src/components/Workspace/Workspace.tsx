import styles from './Workspace.module.css';
import type { Presentation } from '../../types/presentation';
import  SlidePreview from  '../SlidePreview/SlidePreview';
import SlideProperties from '../SlideProperties/SlideProperties';

type WorkspaceProps = {
    presentation: Presentation
    activeSlideIndex: number
    backgroundColorChange: (color: string) => void
    backgroundGradientChange: () => void
    backgroundImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Workspace({ presentation,
    activeSlideIndex,
    backgroundGradientChange,
    backgroundImageChange,
    backgroundColorChange
}: WorkspaceProps) {
    const slides = presentation.slides ?? []
    const slideCurrent = slides[activeSlideIndex]
    if(!slideCurrent) {
        return null
    }
    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>  
                <SlidePreview size='large' slide={slideCurrent} />
            </div>
            <div className={styles.containerTools}>
                <SlideProperties 
                    backgroundColorChange={backgroundColorChange}
                    backgroundGradientChange={backgroundGradientChange}
                    backgroundImageChange={backgroundImageChange}  
                    slide={slideCurrent}/>
            </div>
        </div>
    )
}

export default Workspace;










