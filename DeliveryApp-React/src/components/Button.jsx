export default function Button({
    children,
    onClick,
    type = 'button',
    className = 'btn-danger',
    ...props
}) {
    return (
        <button
            type={type}
            className={'btn ' + className}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
