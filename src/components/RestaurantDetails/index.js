import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import RestaurantFoodItem from '../RestaurantFoodItem'

import Header from '../Header'

import './index.css'

const apiStatusContainer = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class RestaurantDetails extends Component {
  state = {
    apiStatus: apiStatusContainer.initial,
    restaurantsData: {},
    foodData: [],
  }

  componentDidMount() {
    this.getRestaurantDetails()
  }

  getData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    rating: data.rating,
    name: data.name,
    reviewsCount: data.reviews_count,
    location: data.location,
    costForTwo: data.cost_for_two,
    cuisine: data.cuisine,
  })

  foodItems = data => ({
    imageUrl: data.image_url,
    name: data.name,
    cost: data.cost,
    rating: data.rating,
    id: data.id,
  })

  getRestaurantDetails = async () => {
    this.setState({apiStatus: apiStatusContainer.inprogress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/restaurants-list/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getData(data)
      const foodItemsData = data.food_items.map(eachItem =>
        this.foodItems(eachItem),
      )
      this.setState({
        restaurantsData: updatedData,
        foodData: foodItemsData,
        apiStatus: apiStatusContainer.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContainer.failure})
    }
  }

  successView = () => {
    const {restaurantsData, foodData} = this.state
    const {
      imageUrl,
      rating,
      name,
      location,
      reviewsCount,
      costForTwo,
      cuisine,
    } = restaurantsData

    return (
      <>
        <div className="specific-restaurant-details-container">
          <div className="restaurant-banner-container">
            <div className="banner-responsive-container">
              <img
                src={imageUrl}
                alt="restaurant"
                className="specific-restaurant-image"
              />
              <div className="banner-details-container">
                <h1 className="specific-restaurant-name">{name}</h1>
                <p className="specific-restaurant-cuisine">{cuisine}</p>
                <p className="specific-restaurant-location">{location}</p>
                <div className="rating-cost-container">
                  <div className="specific-restaurant-rating-container">
                    <div className="rating-container">
                      <AiFillStar className="restaurant-details-star" />
                      <p className="specific-restaurant-rating">{rating}</p>
                    </div>
                    <p className="specific-restaurant-reviews">
                      {reviewsCount}+ Ratings
                    </p>
                  </div>
                  <hr className="line" />
                  <div className="cost-container">
                    <p className="specific-restaurant-cost">{costForTwo}</p>
                    <p className="specific-restaurant-cost-text">
                      Cost for two
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="food-item-list-container">
            {foodData.map(eachFoodItem => (
              <RestaurantFoodItem
                eachFoodItem={eachFoodItem}
                key={eachFoodItem.id}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  failureView = () => <h1>Failure</h1>

  loadingView = () => (
    <div>
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderRestaurantDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContainer.success:
        return this.successView()
      case apiStatusContainer.failure:
        return this.failureView()
      case apiStatusContainer.inprogress:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderRestaurantDetails()}</div>
      </>
    )
  }
}

export default RestaurantDetails
