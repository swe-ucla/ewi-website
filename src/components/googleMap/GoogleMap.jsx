import React from 'react'
import './googleMap.css'

export const GoogleMap = () => {
  return (
    <div className="google-map-container">
      <h2 className="map-title">where to find us</h2>
      <div className="google-map-wrapper">
        <iframe
          width="100%"
          height="600"
          src="https://maps.google.com/maps?width=500&amp;height=600&amp;hl=en&amp;q=Carnesale%20Commons,%20UCLA,%20Westwood,%20CA&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          title="Google Map - Carnesale Commons, UCLA"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default GoogleMap

