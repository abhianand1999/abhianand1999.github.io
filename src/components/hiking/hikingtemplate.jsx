import React from 'react'
import { hikes } from './hiking-data.js'

const HikeCard = ({ hike }) => {
  const [expanded, setExpanded] = React.useState(false)
  
  return (
    <div style={{
      minWidth: '300px',
      padding: '20px',
      margin: '10px',
      border: '2px solid #e5e7eb', 
      borderRadius: '8px',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
      fontFamily: 'Lora, sans-serif'
    }}>
      <h3 style={{
        fontFamily: 'Lora, sans-serif',
        fontSize: '1.5rem',
        marginBottom: '12px',
        color: '#1f2937'
      }}>{hike.name}</h3>
      
      <p style={{
        color: '#4b5563',
        marginBottom: '16px'
      }}>{hike.location}</p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        color: '#4b5563'
      }}>
        <span>Distance: {hike.distance} mi</span>
        <span>Elevation: {hike.elevation} ft</span>
      </div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          cursor: 'pointer',
          fontFamily: 'Lora, sans-serif',
          padding: '8px 0',
          fontWeight: '500'
        }}
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
      
      {expanded && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: '#4b5563',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>{hike.description}</p>
          
          {hike.tips && (
            <div>
              <h4 style={{
                fontFamily: 'Lora, sans-serif',
                fontSize: '1.1rem',
                marginBottom: '8px',
                color: '#1f2937'
              }}>Tips:</h4>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: '20px',
                color: '#4b5563'
              }}>
                {hike.tips.map((tip, index) => (
                  <li key={index} style={{
                    marginBottom: '4px'
                  }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const HikingSection = () => {
  return (
    <section style={{
      padding: '40px 20px',
    }}>
      <h2 style={{
        fontFamily: 'Lora, sans-serif',
        fontSize: '2rem',
        marginBottom: '24px',
        textAlign: 'center',
        color: '#1f2937'
      }}>Hiking Adventures</h2>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '20px 0',
        gap: '20px',  
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent'
      }}>
        {hikes.map((hike, index) => (
          <HikeCard key={index} hike={hike} />
        ))}
      </div>
    </section>
  )
}

export default HikingSection