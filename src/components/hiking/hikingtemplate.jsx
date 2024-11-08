import React from 'react'
import {hikes} from './hiking-data.js'

const HikeCard = ({ hike }) => {
  const [expanded, setExpanded] = React.useState(false)
  
  return (
    <div className="card">
      <h3>{hike.name}</h3>
      <p>{hike.location}</p>
      <div>
        <span>Distance: {hike.distance} mi</span>
        <span>Elevation: {hike.elevation} ft</span>
      </div>
      
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Show Less' : 'Show More'}
      </button>
      
      {expanded && (
        <div>
          <p>{hike.description}</p>
          {hike.tips && (
            <ul>
              {hike.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

const HikingSection = () => {
  return (
    <section>
      <h2>Hiking Adventures</h2>
      <div className="hikes-container">
        {hikes.map((hike, index) => (
          <HikeCard key={index} hike={hike} />
        ))}
      </div>
    </section>
  )
}

export default HikingSection