// ProductCard.jsx

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 mb-4 w-64">
      <img
        src={product.productImage}
        alt={product.productName}
        className="w-full h-32 object-cover mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{product.productName}</h2>
      <p className="text-gray-700 mb-2">{product.description.join(", ")}</p>
      <p className="text-green-500 font-bold mb-2">${product.discountPrice}</p>
      <p className="text-gray-500 line-through mb-2">${product.price}</p>
      <p className="text-yellow-500">Rating: {product.ratings}</p>
    </div>
  );
};

export default ProductCard;
