import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import RestaurantCard from '../RestaurantCard'
import RestaurantHeader from '../RestaurantHeader'
import Slider from '../Slider'
import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const apiStatusContainer = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class RestaurantsSection extends Component {
  state = {
    apiStatus: apiStatusContainer.initial,
    currentPage: 0,
    restaurantsList: '',
    activeOptionId: 'Lowest',
  }

  componentDidMount() {
    this.getRestaurants()
  }

  getRestaurants = async () => {
    const {currentPage, activeOptionId} = this.state
    this.setState({apiStatus: apiStatusContainer.inprogress})

    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/restaurants-list?offset=${
      currentPage * 9
    }&limit=9&sort_by_rating=${activeOptionId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.restaurants.map(eachRestaurant => ({
        name: eachRestaurant.name,
        cuisine: eachRestaurant.cuisine,
        id: eachRestaurant.id,
        imageUrl: eachRestaurant.image_url,
        rating: eachRestaurant.user_rating.rating,
        totalReviews: eachRestaurant.user_rating.total_reviews,
      }))
      this.setState({
        restaurantsList: updatedData,
        apiStatus: apiStatusContainer.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContainer.failure})
    }
  }

  changeSortBy = activeOption =>
    this.setState({activeOptionId: activeOption}, this.getRestaurants)

  successView = () => {
    const {restaurantsList, activeOptionId} = this.state

    return (
      <>
        <RestaurantHeader
          activeOptionId={activeOptionId}
          sortByOptions={sortByOptions}
          changeSortBy={this.changeSortBy}
        />
        <hr className="hr-line" />
        <ul className="restaurant-list">
          {restaurantsList.map(restaurant => (
            <RestaurantCard details={restaurant} key={restaurant.id} />
          ))}
        </ul>
      </>
    )
  }

  failureView = () => (
    <div className="restaurant-error-view-container">
      <img
        src="https://res.cloudinary.com/djjbttpq0/image/upload/v1641968177/Tasty%20Kitchens/erroring_1x_x7gtp8.png"
        alt="restaurants failure"
        className="restaurant-failure-img"
      />
      <h1 className="restaurant-failure-heading-text">Page Not Found</h1>
      <p className="restaurant-failure-description">
        we are sorry, the page you requested could not be found Please go back
        to the homepage
      </p>
      <button className="error-button" type="button">
        Home Page
      </button>
    </div>
  )

  loadingView = () => (
    <div>
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderRestaurantsView = () => {
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

  leftArrowClicked = () => {
    const {currentPage} = this.state
    if (currentPage > 0) {
      this.setState(
        prev => ({currentPage: prev.currentPage - 1}),
        this.getRestaurants,
      )
    }
  }

  rightArrowClicked = () => {
    const {currentPage} = this.state
    if (currentPage < 3) {
      this.setState(
        prev => ({currentPage: prev.currentPage + 1}),
        this.getRestaurants,
      )
    }
  }

  render() {
    const {currentPage} = this.state
    return (
      <div>
        <Slider />
        <div className="all-restaurant-responsive-container ">
          {this.renderRestaurantsView()}

          <div className="restaurant-navigation">
            <button
              type="button"
              className="arrow-button"
              onClick={this.leftArrowClicked}
            >
              <img
                src="https://res.cloudinary.com/nsp/image/upload/v1635835069/tastyKitchens/Icon_1x_iq50dr.png"
                alt=""
                className="arrow"
              />
            </button>
            <span className="current-page">{currentPage + 1}</span>
            <button
              type="button"
              className="arrow-button"
              onClick={this.rightArrowClicked}
            >
              <img
                src="https://res.cloudinary.com/nsp/image/upload/v1635835103/tastyKitchens/Icon_1x_n6kori.png"
                alt=""
                className="arrow"
              />
            </button>
          </div>
        </div>
      </div>
    )
  }
}
export default RestaurantsSection
