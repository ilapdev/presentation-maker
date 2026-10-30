import styles from './SlideObject.module.css';
import type { SlideObject } from '../../types/objects';
import { useState, useRef, useEffect } from 'react';

type SlideObjectProps = {
    object: SlideObject
    selected?: boolean
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
    onChange?: (value: string) => void
    onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void
    onResizeMouseDown?: (event: React.MouseEvent<HTMLDivElement>, object: SlideObject) => void
    readOnly?: boolean
}

function SlideObjectView({
    object,
    selected = false,
    onClick,
    onChange,
    onMouseDown,
    onResizeMouseDown,
    readOnly
}: SlideObjectProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftText, setDraftText] = useState('');
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing && object.type === 'text') {
            setDraftText(object.content ?? '');
        }
    }, [object, isEditing]);

    const saveText = () => {
        if (!isEditing) return;
        onChange?.(draftText);
        setIsEditing(false);
    };

    const cancelText = () => {
        if (object.type === 'text') {
            setDraftText(object.content ?? '');
        }
        setIsEditing(false);
    };

    const selectionStyle: React.CSSProperties = selected
        ? {
            outline: '1px solid #5af560',
            outlineOffset: '1px',
        }
        : {};

    let renderedObject: React.ReactNode = null;

    if (object.type === 'text') {
        const inputStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${object.x}px`,
            top: `${object.y}px`,
            width: `${object.width}px`,
            height: `${object.height}px`,
            fontFamily: object.fontFamily,
            fontSize: `${object.fontSize}px`,
            color: object.fontColor,
            border: 'none',
            background: 'transparent',
            outline: 'none', 
            resize: 'none',
            boxSizing: 'border-box', 
            padding: '8px',
            overflow: 'hidden', 
            whiteSpace: 'pre-wrap',   
            wordWrap: 'break-word', 
            ...selectionStyle,
            
        };

        renderedObject = isEditing ? (
            <textarea
                ref={inputRef}
                value={draftText}
                style={inputStyle}
                onChange={(event) => setDraftText(event.target.value)}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        cancelText();
                    }

                    if (event.key === 'Enter' && (event.ctrlKey)) {
                        event.preventDefault();
                        saveText();
                    }
                }}
                onBlur={saveText}
                
            />
        ) : (
            <div
                style={inputStyle}
                onClick={(event) => {
                    onClick?.(event);
                }}
                onDoubleClick={(event) => {
                    if (readOnly) return;
                    event.stopPropagation();
                    setDraftText(object.content ?? '');
                    setIsEditing(true);
                }}
                onMouseDown={(event) => {
                    onMouseDown?.(event);
                }}
            >
                {object.content}
            </div>
        );
    
    }

    if (object.type === 'image') {
        const imageStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${object.x}px`,
            top: `${object.y}px`,
            width: `${object.width}px`,
            height: `${object.height}px`,
            ...selectionStyle
        };

        renderedObject = (
            <img
                className={styles.imageObject}
                style={imageStyle}
                src={object.imageUrl}
                alt="image"
                onClick={onClick}
                onMouseDown={onMouseDown}
            />
        );
    }

    return (
        <>
            {renderedObject}
            
            {selected && !isEditing && (
                <div
                    className={styles.resizeHandle}
                    style={{
                        left: `${object.x + object.width - 5}px`,
                        top: `${object.y + object.height - 5}px`
                    }}
                    onMouseDown={(event) =>
                        onResizeMouseDown?.(event, object)
                    }
                />
            )}
        </>
    );
}

export default SlideObjectView;
