export default function Field({
    name,
    label,
    error,
    as = 'input',
    children,
    ...props
}) {
    const Tag = as;
    return (
        <div className="mb-3">
            <label className="form-label" htmlFor={name}>
                {label}
            </label>
            <Tag
                id={name}
                name={name}
                className={'form-control' + (error ? ' is-invalid' : '')}
                aria-invalid={!!error}
                aria-describedby={error ? name + '-error' : undefined}
                {...props}
            >
                {children}
            </Tag>
            {error && (
                <div
                    id={name + '-error'}
                    className="invalid-feedback"
                    role="alert"
                >
                    {error}
                </div>
            )}
        </div>
    );
}
