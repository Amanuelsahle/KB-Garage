import React from 'react';
import TopBanner from '../components/TopBanner/TopBanner';
import AboutUsExperience from '../components/AboutUs/AboutUsExperience';
import Service from '../components/Service/Service';
import Features from '../components/Features/Features';
import WhyAndAdditional from '../components/WhyAndAdditional/WhyAndAdditional';
import BottomBanner from '../components/BottomBanner/BottomBanner';
import Appointment from '../components/Appointment/Appointment';

function Home(props) {
  return (
    <div>
      <TopBanner />
      <AboutUsExperience />
      <Service />
      <Features />
      <WhyAndAdditional />
      <BottomBanner />
      <Appointment />
    </div>
  );
}

export default Home;