import React from 'react'
import lowerBanner from "../../../assets/images/banner/lowerBanner.png"
export default function BottomBanner() {
    return (
        <div> <section className="video-section">
            <div data-parallax='{"y": 50}' className="sec-bg"
                style={{ backgroundImage: `url(${lowerBanner})` }}>

            </div>
            <div className="auto-container">
                <h5>Working since 2006</h5>
                <h2>We are leader <br /> in Car Mechanical Work</h2>
                <div className="video-box">
                    <div className="video-btn"><a href="https://www.youtube.com/watch?v=N9Yc72A&amp;t=28s"
                        className="overlay-link lightbox-image video-fancybox ripple"><i className="flaticon-play"></i></a>
                    </div>
                    <div className="text">Watch intro video <br /> about us</div>
                </div>
            </div>
        </section></div>
    )
}
