import React from 'react';
import { useParams, Link } from 'react-router-dom';
import serviceList from '../../util/CommonServicesFile';
import servicesBanner from '../../assets/images/banner/servicesBanner.png';
import Image7 from '../../assets/images/misc/image-7.png';

function SingleService() {
    const { id } = useParams();
    const serviceIndex = parseInt(id, 10);
    const service = serviceList[serviceIndex] || serviceList[0]; // fallback to first service if invalid

    return (
        <div>
            <section className="page-title" style={{ backgroundImage: `url(${servicesBanner})` }}>
                <div className="auto-container">
                    <h2>Single Service</h2>
                    <ul className="page-breadcrumb">
                        <li><Link to="/">home</Link></li>
                        <li>Single Service</li>
                    </ul>
                </div>
                <h1 data-parallax='{"x": 200}'>Our Service</h1>
            </section>

            <div className="sidebar-page-container">
                <div className="auto-container">
                    <div className="row">
                        <div className="content-side col-xl-9 col-lg-8 order-lg-2">
                            <div className="services-single">
                                <div className="inner-box">
                                    <div className="big-image">
                                        <img src={service.img} alt={service.title} />
                                    </div>
                                    <h2>{service.title}</h2>
                                    <div className="text">
                                        <p>{service.description}</p>
                                        <div className="two-column">
                                            <div className="row clearfix">
                                                <div className="content-column col-md-6">
                                                    <div className="inner-column right-padd">
                                                        <h3>Benefit of Service</h3>
                                                        <p> Keep your vehicle performing at its best with professional auto repair and maintenance services you can trust.We deliver fast, reliable, and affordable solutions to keep you safe on the road every day.</p>
                                                        <ul className="list-style-four">
                                                            <li>Certified & Experienced Technicians</li>
                                                            <li>Fast and Reliable Repair Service</li>
                                                            <li>Affordable Pricing with Quality Parts</li>
                                                            <li>Complete Engine & Brake Diagnostics</li>
                                                            <li>Customer Satisfaction Guaranteed</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="image-column col-md-6">
                                                    <div className="image">
                                                        <img src={Image7} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="facts">
                                        <h3>Some facts works with us</h3>
                                        <div className="text">Our management consulting services focus on our clients most critical issues and opportunities strategy marketing organization operations, technology transformation digital.</div>
                                    </div>

                                    <div className="featured-blocks">
                                        <div className="row">
                                            <div className="featured-block col-md-6">
                                                <div className="featured-inner">
                                                    <div className="content">
                                                        <div className="icon-box">
                                                            <span className="icon flaticon-work-team"></span>
                                                        </div>
                                                        <h3><Link to="#">Professional Team</Link></h3>
                                                        <div className="text">Our shop features certified master technicians and experienced service advisors dedicated to your vehicle's care.</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="featured-block col-md-6">
                                                <div className="featured-inner">
                                                    <div className="content">
                                                        <div className="icon-box">
                                                            <span className="icon flaticon-deadline"></span>
                                                        </div>
                                                        <h3><Link to="#">Delivery on Time</Link></h3>
                                                        <div className="text">We understand that your time is valuable. Utilizing streamlined shop scheduling, rapid digital diagnostics, and efficient parts sourcing.</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="featured-block col-md-6">
                                                <div className="featured-inner">
                                                    <div className="content">
                                                        <div className="icon-box">
                                                            <span className="icon flaticon-manufacture"></span>
                                                        </div>
                                                        <h3><Link to="#">Quality Products</Link></h3>
                                                        <div className="text">We never cut corners on your safety or vehicle longevity. Our facility exclusively utilizes premium original equipment.</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="featured-block col-md-6">
                                                <div className="featured-inner">
                                                    <div className="content">
                                                        <div className="icon-box">
                                                            <span className="icon flaticon-badge"></span>
                                                        </div>
                                                        <h3><Link to="#">#1 Manufacturing Unit</Link></h3>
                                                        <div className="text">Our state-of-the-art facility is equipped with cutting-edge computerized diagnostics, advanced laser wheel alignment machinery.</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-side col-xl-3 col-lg-4">
                            <aside className="sidebar">
                                <div className="sidebar-widget sidebar-blog-category">
                                    <ul className="blog-cat">
                                        {serviceList.map((s, idx) => (
                                            <li className={idx === serviceIndex ? "active" : ""} key={idx}>
                                                <Link to={`/services/${idx}`}>{s.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="sidebar-widget contact-info-widget">
                                    <div className="sidebar-title style-two">
                                        <h2>Our Brochures</h2>
                                    </div>
                                    <div className="inner-box">
                                        <ul>
                                            <li><span className="icon fas fa-phone"></span>1800 456 7890</li>
                                            <li><span className="icon fas fa-paper-plane"></span>kbgarage@mail.com.com</li>
                                        </ul>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleService;