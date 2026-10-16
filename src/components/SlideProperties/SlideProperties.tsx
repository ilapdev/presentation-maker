import styles from './SlideProperties.module.css';
import type { Slide } from '../../types/slide';
import Button from '../Button/Button';
import getStyle from '../../functions/getStyle';

type SlidePropertiesProps = {
    slide: Slide
    backgroundColorChange: (color: string) => void
    backgroundGradientChange: () => void
    backgroundImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function SlideProperties({ 
    slide,
    backgroundColorChange,
    backgroundImageChange,
    backgroundGradientChange 
}: SlidePropertiesProps) {

    function colorChangeClick(event: React.ChangeEvent<HTMLInputElement>) {
        const color = event.target.value
        backgroundColorChange(color)
    }

    function openColorWindow() {
        document.getElementById('colorInput')?.click()
    }
   
    function openImageWindow() {
        document.getElementById('backgroundImageInput')?.click()
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.slideName}>{slide.name}</span>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Фон</h3>
                <div className={styles.colorRow}>
                    <Button
                        className="itemColor"
                        onClick={openColorWindow}
                    />
                    <Button
                        className="itemGradient"
                        onClick={backgroundGradientChange}
                    />
                    <Button
                        className="itemFoto"
                        onClick={openImageWindow}
                    />
                </div>

                <div
                    className={styles.preview}
                    style={getStyle(slide.background)}
                />
                <input
                    type="color"
                    id="colorInput"
                    onChange={colorChangeClick}
                    hidden
                />
                <input
                    type="file"
                    id="backgroundImageInput"
                    accept="image/*"
                    onChange={backgroundImageChange}
                    hidden
                />
            </div>
        </div>
    );
}

export default SlideProperties;
