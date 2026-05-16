import React from 'react'
import ServicesTopBanner from '../components/TopBanner/ServicesTopBanner'
import WhyAndAdditional from '../components/WhyAndAdditional/WhyAndAdditional'
import BottomBanner from '../components/BottomBanner/BottomBanner'
import Appointment from '../components/Appointment/Appointment'
import Service from '../components/Service/Service'

function Services() {
  return (
    <div>
        <ServicesTopBanner/>
        <Service/>
       <WhyAndAdditional />
            <BottomBanner />
            <Appointment />
    </div>
  )
}

export default Services