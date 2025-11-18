import React from 'react'
import './googleMap.css'

export const GoogleMap = () => {
  return (
    <div className="google-map-container">
      <div className="google-map-wrapper">
        <iframe
          width="100%"
          height="600"
          src="https://maps.google.com/maps?width=500&amp;height=600&amp;hl=en&amp;q=Covel%20Commons+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          title="Google Map - Covel Commons"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default GoogleMap

