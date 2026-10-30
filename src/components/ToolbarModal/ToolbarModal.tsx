import styles from './ToolbarModal.module.css';
import Button from '../Button/Button';

type ToolbarModalProps = {
    onAddImage: () => void
    onSavePdf: () => void
    canUndo: boolean
    canRedo: boolean
    onUndo: () => void
    onRedo: () => void
    addTextToCurrentSlide: () => void
}

function ToolbarModal({
    onAddImage,
    onSavePdf, 
    canUndo, 
    canRedo, 
    onUndo, 
    onRedo, 
    addTextToCurrentSlide
}: ToolbarModalProps){
    return (
        <div className={styles.modalTools}>
            <Button 
                onClick={addTextToCurrentSlide}
                item={styles.Text} 
            />
            <Button
                item={styles.Image}
                onClick={onAddImage}
            />
            <Button
                item={styles.Pdf}
                text='PDF'
                onClick={onSavePdf}
            />
            <Button
                item={styles.backOne}
                onClick={onUndo}
                disabled={!canUndo}
            />
            <Button
                item={styles.backTwo}
                onClick={onRedo}
                disabled={!canRedo}
            />
        </div>
    );
}

export default ToolbarModal;