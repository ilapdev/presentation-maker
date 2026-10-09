import styles from './Button.module.css'
type ButtonProps = {
    text: string
    onClick: () => void
    className?: string
};

function Button({ text, onClick, className }: ButtonProps) {
    return (
        <button 
            type="button" 
            className={className ? `${styles.buttonClass} ${styles[className]}` : styles.buttonClass}
            onClick={onClick}
        >
            { text }
        </button>
    );
}

export default Button;










