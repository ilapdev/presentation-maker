import styles from './Workspace.module.css';
import type { Presentation } from '../../types/presentation';
import  SlidePreview from  '../SlidePreview/SlidePreview';
import SlideProperties from '../SlideProperties/SlideProperties';

type WorkspaceProps = {
    presentation: Presentation
    activeSlideIndex: number
}

function Workspace({ presentation, activeSlideIndex}: WorkspaceProps) {
    const slides = presentation.slides ?? []
    const slideCurrent = slides[activeSlideIndex]
   
    if(!slideCurrent) {
        return null; 
    }
        
    return (
        <div className={styles.container}>
            <div className={styles.containerMain}>  
                <SlidePreview size='large' slide={slideCurrent} />
            </div>
            <div className={styles.containerTools}>
                <SlideProperties slide={slideCurrent}/>
            </div>
        </div>
    );
    
}

export default Workspace;










