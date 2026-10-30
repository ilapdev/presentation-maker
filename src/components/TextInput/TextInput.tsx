import type { CSSProperties, MouseEvent } from 'react'
import styles from './TextInput.module.css'

type TextInputProps = {
    value: string | number
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    stylesCSS?: CSSProperties
    onClick?: (event: MouseEvent<HTMLInputElement>) => void
    type?: string
    min?: number
    max?: number                          
}

function TextInput({ 
    value,
    onChange,
    placeholder, 
    className, 
    stylesCSS, 
    onClick, 
    type, 
    min, 
    max 
}: TextInputProps) {
    return (
        <input 
            className={className ? `${styles.input} ${styles[className]}` : styles.input }
            placeholder={placeholder} 
            value={value}
            style={stylesCSS}
            onClick={onClick}
            onChange={(event) => onChange?.(event.target.value)}
            type={type}
            min={min}
            max={max}
        />
    );
}

export default TextInput;





