import React from 'react'
import ContactUsTopBanner from '../components/TopBanner/ContactTopBanner'
import Appointment from '../components/Appointment/Appointment'
import ContactUs from '../components/ContactUs/ContactUs'

function Contact() {
    return (
        <div>
            <ContactUsTopBanner />
            <ContactUs />
            <Appointment />

        </div>
    )
}

export default Contact