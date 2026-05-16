import React from 'react'
import aboutUsBanner from "../../../assets/images/banner/AboutUsBanner.png"

function ContactTopBanner() {
    return (
        <div>   <section className="page-title" style={{ backgroundImage: `url(${aboutUsBanner})` }}>
            <div className="auto-container">
                <h2>Contact</h2>
                <ul className="page-breadcrumb">
                    <li><a href="index.html">home</a></li>
                    <li>Contact</li>
                </ul>
            </div>
            <h1 data-parallax='{"x": 200}'>Contact Us</h1>
        </section></div>
    )
}

export default ContactTopBanner