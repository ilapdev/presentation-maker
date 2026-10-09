import styles from './Toolbar.module.css';
import type { Presentation } from '../../types/presentation';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';

type ToolbarProps = {
    presentation: Presentation
    onNameChange: (name: string) => void
    onAddSlide: () => void
    onAddImage: () => void
    onSave: () => void
    onPreview: () => void
}

function Toolbar({
    presentation,
    onNameChange,
    onAddSlide,
    onAddImage,
    onSave,
    onPreview,
}: ToolbarProps ) {
    return (
        <header className={styles.header}>
            <TextInput 
                className="title"
                value={presentation.name}
                placeholder="Название презентации"
                onChange={onNameChange}
            />
            <div className={styles.actions}>
                <Button
                    className="addElement"
                    text="Slide"
                    onClick={onAddSlide}
                />
                <Button
                    className="imageAdd"
                    text="Image"
                    onClick={onAddImage}
                />
                <Button
                    className="saveElement"
                    text="Save"
                    onClick={onSave}
                />
                <Button
                    className="previewElement"
                    text="Preview"
                    onClick={onPreview}
                />
            </div>
        </header>
    );
}

export default Toolbar;










