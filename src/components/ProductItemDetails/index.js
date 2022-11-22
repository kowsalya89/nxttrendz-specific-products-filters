import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const productDataAPIResponseStates = {
  initial: 'UNINITIATED',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class ProductItemDetails extends Component {
  state = {
    productQuantity: 1,
    productDataResponseStatus: productDataAPIResponseStates.initial,
    productAPIResponseData: {},
  }

  componentDidMount() {
    this.getRequestedProductDetails()
  }

  convertSnakeCasedProductResponseDataToCamelCasedJSON = snakeCasedData => ({
    id: snakeCasedData.id,
    imageUrl: snakeCasedData.image_url,
    title: snakeCasedData.title,
    price: snakeCasedData.price,
    description: snakeCasedData.description,
    brand: snakeCasedData.brand,
    totalReviews: snakeCasedData.total_reviews,
    rating: snakeCasedData.rating,
    availability: snakeCasedData.availability,
    similarProducts: snakeCasedData.similar_products.map(
      similarProductListItem => ({
        id: similarProductListItem.id,
        imageUrl: similarProductListItem.image_url,
        title: similarProductListItem.title,
        style: similarProductListItem.style,
        price: similarProductListItem.price,
        description: similarProductListItem.description,
        brand: similarProductListItem.brand,
        totalReviews: similarProductListItem.total_reviews,
        rating: similarProductListItem.rating,
        availability: similarProductListItem.availability,
      }),
    ),
  })

  getRequestedProductDetails = async () => {
    this.setState({
      productDataResponseStatus: productDataAPIResponseStates.loading,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookie.get('jwt_token')

    const productDataRequestUrl = `https://apis.ccbp.in/products/${id}`
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const productDataAPIResponse = await fetch(
      productDataRequestUrl,
      requestOptions,
    )
    const responseJSONData = await productDataAPIResponse.json()

    let currentProductDataAPIResponseState = null
    let formattedProductSpecificData = {}
    if (productDataAPIResponse.ok) {
      currentProductDataAPIResponseState = productDataAPIResponseStates.success
      formattedProductSpecificData = this.convertSnakeCasedProductResponseDataToCamelCasedJSON(
        responseJSONData,
      )
    } else {
      currentProductDataAPIResponseState = productDataAPIResponseStates.failure
      formattedProductSpecificData = {
        statusCode: responseJSONData.status_code,
        errorMsg: responseJSONData.error_msg,
      }
    }

    this.setState({
      productDataResponseStatus: currentProductDataAPIResponseState,
      productAPIResponseData: formattedProductSpecificData,
    })
  }

  onContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onIncreaseProductQuantity = () =>
    this.setState(prevProductItemState => ({
      productQuantity: prevProductItemState.productQuantity + 1,
    }))

  onDecreaseProductQuantity = () =>
    this.setState(prevProductItemState => ({
      productQuantity:
        prevProductItemState.productQuantity > 1
          ? prevProductItemState.productQuantity - 1
          : 1,
    }))

  renderProductSpecificDetailsView = () => {
    const {productAPIResponseData, productQuantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productAPIResponseData

    return (
      <div className="product-item-details-bg-container">
        <div className="product-item-details-content-container">
          <img className="product-item-img" src={imageUrl} alt="product" />
          <div className="product-details">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-rating-reviews-container">
              <p className="product-rating">
                {rating}
                <img
                  className="product-rating-star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </p>
              <p className="product-review-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="other-product-detail">
              <span className="other-product-detail-name">Available:</span>{' '}
              {availability}
            </p>
            <p className="other-product-detail">
              <span className="other-product-detail-name">Brand:</span> {brand}
            </p>
            <hr className="lighter-horizontal-line-separator" />
            <div className="product-quantity-and-cart-controls-container">
              <div className="product-quantity-controls-container">
                <button
                  type="button"
                  className="product-quantity-control-button"
                  onClick={this.onDecreaseProductQuantity}
                >
                  <BsDashSquare className="product-quantity-control-button-icon" />
                </button>
                <p className="product-quantity">{productQuantity}</p>
                <button
                  type="button"
                  className="product-quantity-control-button"
                  onClick={this.onIncreaseProductQuantity}
                >
                  <BsPlusSquare className="product-quantity-control-button-icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <div className="similar-products-content-container">
          <h1 className="similar-products-header">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(similarProductListItem => (
              <SimilarProductItem
                key={similarProductListItem.id}
                itemData={similarProductListItem}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductNotFoundView = () => {
    const {productAPIResponseData} = this.state
    const {errorMsg} = productAPIResponseData

    return (
      <div className="product-not-found-container">
        <img
          className="product-not-found-img"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1 className="product-not-found-header">{errorMsg}</h1>
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.onContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  renderThreeDotsLoader = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderUIBasedOnProductAPIResponseStatus = productAPIResponseStatus => {
    let finalUI = null

    if (
      productAPIResponseStatus === productDataAPIResponseStates.loading ||
      productAPIResponseStatus === productDataAPIResponseStates.initial
    ) {
      finalUI = this.renderThreeDotsLoader()
    } else if (
      productAPIResponseStatus === productDataAPIResponseStates.failure
    ) {
      finalUI = this.renderProductNotFoundView()
    } else if (
      productAPIResponseStatus === productDataAPIResponseStates.success
    ) {
      finalUI = this.renderProductSpecificDetailsView()
    }

    return finalUI
  }

  render() {
    const {productDataResponseStatus} = this.state

    return (
      <div className="product-item-details-bg-container">
        <Header />
        {this.renderUIBasedOnProductAPIResponseStatus(
          productDataResponseStatus,
        )}
      </div>
    )
  }
}
