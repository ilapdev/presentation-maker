import styles from './SlideProperties.module.css';
import { useState, useEffect } from 'react';
import type { Slide } from '../../types/slide';
import Button from '../Button/Button';
import { updateTextObjectStyle } from '../../functions/objects';
import getStyle from '../../functions/getStyle';
import { dispatch } from '../../editor';
import type { TextObject } from '../../types/objects';
import TextInput from '../TextInput/TextInput';
import { FONTS_LIST } from '../../assets/fonts/FONTS_LIST';
import Select from '../Select/Select';

type SlidePropertiesProps = {
    slide: Slide
    activeSlideIndex: number
    selectedObjectIds: string[]
    backgroundColorChange: (color: string) => void
    backgroundImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    setGradientColor?: (index: 0 | 1, color: string) => void
    gradientColors?: string[]
    gradientAngle?: number
    setGradientAngle?: (angle: number) => void
    onPresentationChange: (presentation: any) => void
    onSave: () => void
    onPreview: () => void
    onClearBackground: () => void
    backgroundGradientChange: () => void
}

function SlideProperties({ 
    slide,
    backgroundColorChange,
    backgroundImageChange,
    setGradientColor,
    gradientAngle,
    gradientColors = ['#000000', '#FFFFFF'], 
    setGradientAngle,
    selectedObjectIds,
    onPresentationChange,
    activeSlideIndex,
    onSave,
    onPreview,
    onClearBackground,
    backgroundGradientChange
}: SlidePropertiesProps) {

    // поиск выделенного обьекта
    const selectedObject = slide.objects.find(obj => selectedObjectIds.includes(obj.id));
    // При выделении объектом изображения панель свойств текста должна скрываться.
    const isTextSelected = selectedObject && selectedObject.type === 'text';

    const [isTypeGradient, setIsTypeGradient] = useState(slide.background.type === 'gradient');
    useEffect(() => {
        setIsTypeGradient(slide.background.type === 'gradient');
    }, [slide.id, slide.background.type]);

    // Использовать useState для хранения текущих значений свойств в компоненте панели
    const [fontfamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState('#000000');

    // Использовать useEffect для синхронизации состояния панели с выделенным объектом:
    // При смене выделенного объекта или переключении на другой объект панель обновляется и показывает его текущие свойства
    useEffect(() => {
        if (isTextSelected && selectedObject) {
            const textObj = selectedObject as TextObject;
            
            setFontFamily(textObj.fontFamily ?? 'Arial');
            setFontSize(textObj.fontSize ?? 16);
            setFontColor(textObj.fontColor ?? '#000000');
        }
    }, [selectedObject?.id, isTextSelected]); 

    // Применение изменений — при изменении любого поля вызывать updateTextObjectStyle через dispatch
    // Визуальный фидбек — текст на слайде должен обновляться в реальном времени при изменении свойств
    const applyTextStyleChange = (changes: { fontFamily?: string; fontSize?: number; fontColor?: string }) => {
        if (!selectedObject || selectedObject.type !== 'text') return;

        const textObj = selectedObject as TextObject;
        const nextFamily = changes.fontFamily ?? (selectedObject.fontFamily ?? 'Arial');
        const nextSize = changes.fontSize ?? (selectedObject.fontSize ?? 16);
        const nextColor = changes.fontColor ?? (selectedObject.fontColor ?? '#000000');

        const updatedPresentation = dispatch((model) => {
            return {
                ...model,
                slides: model.slides.map((slide, index) => {
                    if (index !== activeSlideIndex) return slide;
                    return updateTextObjectStyle(slide, textObj.id, nextFamily, nextSize, nextColor);
                })
            };
        });

        if (updatedPresentation) {
            onPresentationChange(updatedPresentation);
        }
    };

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
                <Button
                    item={styles.saveIcon}
                    onClick={onSave}
                />
                <Button
                    item={styles.previewIcon}
                    onClick={onPreview}
                />
            </div>
        
            { isTextSelected && selectedObject ? (
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>Шрифт</label>
                    <div className={styles.colorRowTwo}>
                        
                    <Select
                        value={fontfamily}
                        options={FONTS_LIST}
                        onChange={(value) => {
                            setFontFamily(value);
                            applyTextStyleChange({ fontFamily: value });
                        }}
                    />
                    </div>

                    <div className={styles.sectionTwo}>
                        <label className={styles.sectionLabel}>Размер</label>
                        <div className={styles.sectionNumber}>
                            <Button
                                item={styles.minus}
                                onClick={() => {
                                const value = Math.max(8, fontSize - 1);
                                setFontSize(value);
                                applyTextStyleChange({ fontSize: value });
                                }} 
                            />
                            <TextInput 
                                className="inputNumber"
                                type='number'
                                value={fontSize.toString()}
                                min={8}
                                max={200}
                                onChange={(value)=> {
                                const numValue = Number(value);
                                setFontSize(numValue);
                                applyTextStyleChange({ fontSize: numValue });
                            }}
                            />
                            <Button
                                item={styles.plus}
                                onClick={() => {
                                    const value = Math.min(200, fontSize + 1);
                                    setFontSize(value);
                                    applyTextStyleChange({ fontSize: value });
                                }} 
                            />
                        </div>
                        
                        <div className={styles.sectionThree}>
                            <label className={styles.sectionLabel}>Цвет:</label>
                            <TextInput 
                                className="inputColor"
                                type="color" 
                                value={fontColor} 
                                onChange={(value) => {
                                    setFontColor(value);
                                    applyTextStyleChange({ fontColor: value });
                                }} 
                            />
                        </div>
                    </div>
                </div>
            ) : (
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Фон</h3>
                <div className={styles.colorRow}>
                    <Button
                        item={
                            `${styles.itemNone} 
                            ${slide.background.type === 'none' ? styles.active : ''}`
                        }
                        onClick={onClearBackground}
                    />
                    <Button
                        item={
                            `${styles.itemColor} 
                            ${slide.background.type === 'solid' ? styles.active : ''}`
                        }
                        onClick={openColorWindow}
                    />
                    <Button
                        item={
                            `${styles.itemGradient}
                            ${slide.background.type === 'gradient' ? styles.active : ''}`
                        }
                        onClick={() => {
                            setIsTypeGradient(true);
                            backgroundGradientChange();
                        }}
                    />
                    <Button
                        item={
                            `${styles.itemFoto}
                             ${slide.background.type === 'image' ? styles.active : ''}`
                        }
                        onClick={openImageWindow}
                    />
                </div>
    
                <div
                    className={styles.preview}
                    style={ getStyle(slide.background) }
                />
               {isTypeGradient && (
                    <div className={styles.sectionTwo}>
                        <h3 className={styles.sectionTitle}>Градиент</h3>
                        <div className={styles.gradientControls}>
                            <div className={styles.colorPickerRow}>
                                <span className={styles.colorLabel}>Цвет 1</span>
                                <TextInput
                                    className='inputColor'
                                    type="color"
                                    value={gradientColors[0] ?? ''}
                                    onChange={(value) => setGradientColor?.(0, value)}
                                />
                            </div>

                            <div className={styles.colorPickerRow}>
                                <span className={styles.colorLabel}>Цвет 2</span>
                                <TextInput
                                    className='inputColor'
                                    type="color"
                                    value={gradientColors[1] ?? ''}
                                    onChange={(value) => setGradientColor?.(1, value)}
                                />
                            </div>

                            <div className={styles.angleRow}>
                                <span className={styles.colorLabel}>Угол</span>
                                <TextInput
                                    className="inputNumber"
                                    type="number"
                                    min={0}
                                    max={360}
                                    value={gradientAngle!}
                                    onChange={(value)=> {
                                        if (value === '') return;
                                        const numValue = parseInt(value, 10);
                                        if (!isNaN(numValue)) {
                                            const clamped = Math.min(360, Math.max(0, numValue));
                                            if (setGradientAngle) {
                                                setGradientAngle(clamped); 
                                            }
                                        }
                                    }}
                                />   
                            </div>
                        </div>
                    </div>
                )}
               
            </div>                    
            )}
            
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
    );
}

export default SlideProperties;
