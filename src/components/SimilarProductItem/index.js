// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {itemData} = props
  const {imageUrl, title, brand, price, rating} = itemData

  return (
    <li className="similar-product-item-container">
      <img
        className="similar-product-item-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <p className="similar-product-item-title">{title}</p>
      <p className="similar-product-item-brand">by {brand}</p>
      <div className="similar-product-item-price-rating-container">
        <p className="similar-product-item-price">Rs {price}/-</p>
        <p className="similar-product-item-rating">
          {rating}{' '}
          <img
            className="similar-product-item-rating-star-img"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
