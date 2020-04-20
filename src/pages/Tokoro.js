import React from 'react';
import 'typeface-pt-serif';
import MetaTags from 'react-meta-tags';
import useHorizontal from '@oberon-amsterdam/horizontal/hook';
import InViewMonitor from 'react-inview-monitor';
import config from 'react-reveal/globals';
import "animate.css/animate.min.css";

config({ ssrFadeout: true });

//https://medium.com/oberonamsterdam/creating-a-horizontally-scrolling-website-9b14e4e048eb
export default () => {
  useHorizontal();
  
  return (
    <React.Fragment>
      <MetaTags>
          <title>Adrià Compte | Tokoro Branding & Design Concepts</title>
          <meta name="description" content="Design concepts for solojuegos and ongames" />
          <meta property="og:title" content="Adrià Compte | Solojuegos Design Concepts" />
      </MetaTags>
      <div className="flex-page-wrapper">
          <article className="main-text">
            <div>
              <h1>Tokoro</h1>
              <h2 className="tokoro-subtitle">Branding & Design Concepts</h2>
              <p>
                While working in the tech industry it's easy to come up with new ideas
                for websites or applications and start side projects that might be
                never finished. This is an example of one of those projects.
              </p>
              <p>
                Tokoro means place in Japanese, this app intended to be a friendly way to share
                your favourite places in the cities you visited or lived in. Very similar to 
                what mapstr does.
              </p>
              <p>
                I started this project with a couple of friends and as I liked the concept and
                enjoyed the process of designing it, came up with a name, made the initial Branding
                and created some high fidelity mockups to try to start a new design system from 
                scratch on my own.
              </p>
              <p>
                Here are some screenshots of what the app intended to be and how I thought the 
                interactions might take place. There wasn't any extensive user research done but 
                it's based on tripadvisor and mapstr, similar projects that already exist.
              </p>
            </div>
          </article>
        <div className="image-block-mobile">
          <img alt="tokoro branding" src="https://res.cloudinary.com/muniatu/image/upload/v1587333992/tokoro/tokoro-branding.jpg"/>
        </div>
          <div className="image-block-mobile">
            <img alt="tokoro login screen" src="https://res.cloudinary.com/muniatu/image/upload/v1587332454/tokoro/tokoro-login.jpg"/>
          </div>
          <div className="image-block-mobile">
            <img alt="tokoro login second step" src="https://res.cloudinary.com/muniatu/image/upload/v1587332471/tokoro/tokoro-login-2.jpg"/>
          </div>
          <div className="image-block-mobile">
            <img alt="tokoro login third step" src="https://res.cloudinary.com/muniatu/image/upload/v1587332471/tokoro/tokoro-login-3.jpg"/>
          </div>
          <div className="image-block-mobile">
              <img alt="tokoro home page" src="https://res.cloudinary.com/muniatu/image/upload/v1587332471/tokoro/tokoro-home.jpg"/>
          </div>
          <div className="image-block-mobile">
            <img alt="tokoro home page extended" src="https://res.cloudinary.com/muniatu/image/upload/v1587336760/tokoro/tokoro-home-2.jpg"/>
          </div>
          <InViewMonitor
            classNameNotInView='vis-hidden'
            classNameInView='animated fadeInRight'
          >
          <div className="image-block-mobile">
            <img alt="tokoro map" src="https://res.cloudinary.com/muniatu/image/upload/v1587332472/tokoro/tokoro-map.jpg"/>
          </div>
          </InViewMonitor>
          <InViewMonitor
            classNameNotInView='vis-hidden'
            classNameInView='animated fadeInRight'
          >
          <div className="image-block-mobile">
            <img alt="tokoro map extended" src="https://res.cloudinary.com/muniatu/image/upload/v1587336771/tokoro/tokoro-map-2.jpg"/>
          </div>
          </InViewMonitor>
          <InViewMonitor
            classNameNotInView='vis-hidden'
            classNameInView='animated fadeInRight'
          >
          <div className="image-block-mobile">
            <img alt="tokoro activity feed" src="https://res.cloudinary.com/muniatu/image/upload/v1587336764/tokoro/tokoro-acitivty-feed.jpg"/>
          </div>
          </InViewMonitor>
          <InViewMonitor
            classNameNotInView='vis-hidden'
            classNameInView='animated fadeInRight'
          >
          <div className="image-block-mobile rowfix">
            <img alt="tokoro profile page" src="https://res.cloudinary.com/muniatu/image/upload/v1587336762/tokoro/tokoro-profile.jpg"/>
          </div>
          </InViewMonitor>
          <div className="rowfix">
          </div>
      </div>
    </React.Fragment>
  )
}
