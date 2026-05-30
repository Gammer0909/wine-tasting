function Card({ title, image, children, className, ...props}) {
    return (
        <div className={`card ${className && className}`} {...props}>
            {image && <img src={image} alt={title} />}
            {title && <h3>{title}</h3>}
            {children && <div className="card-content">{children}</div>}
        </div>
    )
}

export default Card