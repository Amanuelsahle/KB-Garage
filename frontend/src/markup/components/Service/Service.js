import React from 'react'
import { Link } from 'react-router-dom';
import serviceList from "../../../util/CommonServicesFile"

function Service() {
    return (
        <div><section className="services-section">
            <div className="auto-container">
                <div className="sec-title style-two">
                    <h2>Our Featured Services</h2>
                    <div className="text">Bring to the table win-win survival strategies to ensure proactive domination. At
                        the end of the day, going forward, a new normal that has evolved from generation X is on the
                        runway heading towards a streamlined cloud solution. </div>
                </div>
                <div className="row">
                    {serviceList.map((service, i) => (
                        <div className="col-lg-4 service-block-one" key={i}>
                            <div className="inner-box hvr-float-shadow">
                                <h5>Service and Repairs</h5>
                                <h2>{service.title}</h2>
                                <Link to={`/services/${i}`} className="read-more">read more +</Link>
                                <div className="icon"><span className={service.icon}></span></div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </section></div>
    )
}

export default Service