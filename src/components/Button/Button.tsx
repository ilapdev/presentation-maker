import styles from './Button.module.css';

type ButtonProps = {
    text?: string
    item?: string
    onClick: () => void
    className?: string
    disabled?: boolean
}

function Button({ text, item, onClick, className, disabled }: ButtonProps) {
    return (
        <button 
            type="button" 
            className={`${styles.buttonClass} ${className ?? '' } ${item ?? ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            { text }
        </button>
    );
}

export default Button;










