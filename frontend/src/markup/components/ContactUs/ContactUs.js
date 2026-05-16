import React from 'react'

function ContactUs() {
    const mapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3250.169604424517!2d38.59517293990062!3d7.198211983648731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2set!4v1778935094433!5m2!1sen!2set"
    return (
        <div><section className="contact-section">
            <div className="auto-container">

                <div className="row clearfix">


                    <div className="form-column col-lg-7">
                        <div className="inner-column">

                            <div className="contact-form">
                                <div className="contact-map">
                                    <iframe
                                        src={mapUrl}
                                        width="500"
                                        height="470"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Map"
                                    ></iframe> </div>
                            </div>

                        </div>
                    </div>


                    <div className="info-column col-lg-5">
                        <div className="inner-column">
                            <h4>Our Address</h4>
                            <div className="text">Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service.</div>
                            <ul>
                                <li><i className="flaticon-pin"></i><span>Address:</span> Ethiopia, Shashamene La city, IA 5224</li>
                                <li><i className="flaticon-email"></i><span>email:</span> contact@buildtruck.com</li>
                                <li><i className="flaticon-phone"></i><span>phone:</span> 1800 456 7890  /  1254 897 3654</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section> <section className="map-section">

            </section></div>
    )
}

export default ContactUs