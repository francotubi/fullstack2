import ProductCard from './ProductCard';
export default function ProductList({ products, onAdd }) {
    return products.length ? (
        <div className="row g-4">
            {products.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-4 col-xl-3">
                    <ProductCard product={product} onAdd={onAdd} />
                </div>
            ))}
        </div>
    ) : (
        <p role="status">No se encontraron productos.</p>
    );
}
