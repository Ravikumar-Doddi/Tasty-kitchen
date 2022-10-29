import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusContainer = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

export default class ReactSlider extends Component {
  state = {apiStatus: apiStatusContainer.initial, sliderImages: []}

  componentDidMount() {
    this.makeFetchCall()
  }

  makeFetchCall = async () => {
    this.setState({apiStatus: apiStatusContainer.inprogress})

    const url = 'https://apis.ccbp.in/restaurants-list/offers'
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.offers.map(eachData => ({
        id: eachData.id,
        imageUrl: eachData.image_url,
      }))
      this.setState({
        sliderImages: updatedData,
        apiStatus: apiStatusContainer.success,
      })
    }
  }

  successView = () => {
    const {sliderImages} = this.state

    const settings = {
      dots: true,
      autoplay: true,
      arrows: true,
    }

    return (
      <div className="img-cont">
        <Slider {...settings}>
          {sliderImages.map(eachImg => (
            <div key={eachImg.id}>
              <img src={eachImg.imageUrl} alt="offer" className="slider-img" />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  failureView = () => <h1>Oops Something went wrong!</h1>

  loadingView = () => (
    <div>
      <Loader type="Oval" color="#F7931E" height="50" width="50" />
    </div>
  )

  renderAllImages = () => {
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
    return <div className="slider-cont">{this.renderAllImages()}</div>
  }
}
