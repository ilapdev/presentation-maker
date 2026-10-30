import styles from './Select.module.css';

type SelectProps = {
    value: string
    options: string[];   
    onChange: (value: string) => void
    className?: string
}

function Select({ value, options, onChange, className }: SelectProps) {
    return (
        <select
            className={className ? `${styles.selectFont} ${className}` : styles.selectFont}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    )
}

export default Select;
