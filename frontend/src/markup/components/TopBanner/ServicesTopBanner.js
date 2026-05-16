import React from 'react'
import servicesBanner from "../../../assets/images/banner/servicesBanner.png"

function ServicesTopBanner() {
  return (
    <div> 
        <section className="page-title" style={{backgroundImage: `url(${servicesBanner})`}}>
        <div className="auto-container">
            <h2>Our Services</h2>
            <ul className="page-breadcrumb">
                <li><a href="index.html">home</a></li>
                <li>Services</li>
            </ul> </div>
        <h1 data-parallax='{"x": 200}'>Services</h1>
    </section></div>
  )
}

export default ServicesTopBanner