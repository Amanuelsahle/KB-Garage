import React from 'react'
import AboutUsTopBanner from '../components/TopBanner/AboutUsTopBanner'
import AboutUsSkill from '../components/AboutUs/AboutUsSkill'
import AboutUsExperience from '../components/AboutUs/AboutUsExperience'
import WhyAndAdditional from '../components/WhyAndAdditional/WhyAndAdditional'
import BottomBanner from '../components/BottomBanner/BottomBanner'
import Appointment from '../components/Appointment/Appointment'

function About() {
    return (
        <div>
            <AboutUsTopBanner />
            <AboutUsSkill />
            <AboutUsExperience />
            <WhyAndAdditional />
            <BottomBanner />
            <Appointment />
        </div>
    )
}

export default About