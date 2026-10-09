import type { CSSProperties } from 'react'
import styles from './TextInput.module.css'

type TextInputProps = {
    value: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    stylesCSS?: CSSProperties
}

function TextInput({ value, onChange, placeholder, className, stylesCSS}: TextInputProps & CSSProperties) {
    return (
        <input 
            className={className ? `${styles.input} ${styles[className]}` : styles.input }
            placeholder={placeholder} 
            value={value}
            style={stylesCSS}
            onChange={(event) => onChange?.(event.target.value)}
            
        />
        
    );
}

export default TextInput;





