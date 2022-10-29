import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const RestaurantCard = props => {
  const {details} = props
  const {imageUrl, name, cuisine, rating, totalReviews, id} = details

  return (
    <li className="restaurant-item">
      <Link to={`/restaurant/${id}`} className="link-item">
        <img src={imageUrl} alt="restaurant" className="restaurant-image" />
        <div>
          <h1 className="restaurant-name">{name}</h1>
          <p className="restaurant-cuisine">{cuisine}</p>
          <div className="rating-container">
            <AiFillStar className="star" />
            <p className="rating">{rating}</p>
            <p className="reviews">({totalReviews} rating)</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default RestaurantCard
