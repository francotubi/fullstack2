export default function Feedback({ message, type = 'danger' }) {
    return message ? (
        <div
            className={'alert alert-' + type}
            role={type === 'danger' ? 'alert' : 'status'}
        >
            {message}
        </div>
    ) : null;
}
