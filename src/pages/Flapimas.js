import React from 'react';
import 'typeface-pt-serif';
import MetaTags from 'react-meta-tags';
import useHorizontal from '@oberon-amsterdam/horizontal/hook';

//https://medium.com/oberonamsterdam/creating-a-horizontally-scrolling-website-9b14e4e048eb
export default () => {
  useHorizontal();
  
  return (
    <React.Fragment>
      <MetaTags>
        <title>Adrià Compte | Flapimas Game Design & Development</title>
        <meta name="description" content="Flapimas game design and development" />
        <meta property="og:title" content="Adrià Compte | Flapimas Game Design & Development" />
      </MetaTags>
      <div className="flex-page-wrapper">
        <article className="main-text">
          <div>
            <h1>Flapimas</h1>
            <h2 className="flapimas-subtitle">Game Design & Development</h2>
            <p>
              I made this project in 2014 just for fun as way to learn how to
              create a game in Unity and publish my first app in the Google
              Play Store.
            </p>
            <p>
              It's basically a Flappy Bird clone where the protagonist is the 
              former Catalan president Artur Mas trying to escape from Spain.
              An ironic view of the Catalan independence process. As a 
              curiosity, the game is pretty frustrating and never ends, 
              similar to the Spanish political conflict.
            </p>
            <p>
              After I published it I didn't go for any further development but the game
              was featured in a few local news sites, radio and even TV. It's still
              available on the Google Play Store, feel free to try it!
            </p>
            <a className="google-play-button" href="https://res.cloudinary.com/muniatu/image/upload/v1587393384/flapimas/gplay-button.png"><img width="220" src="https://res.cloudinary.com/muniatu/image/upload/v1587392344/gplay-button.png" alt="google play button"/></a>
          </div>
        </article>
        <div className="image-block-mobile">
            <img alt="flapimas home" src="https://res.cloudinary.com/muniatu/image/upload/v1587394168/flapimas/flapimas-screen-1.jpg"/>
        </div>
        <div className="image-block-mobile">
            <img alt="flapimas tutorial" src="https://res.cloudinary.com/muniatu/image/upload/v1587394296/flapimas/flapimas-screen-2.jpg"/>
        </div>
        <div className="image-block-mobile">
            <img alt="solojuegos in-game" src="https://res.cloudinary.com/muniatu/image/upload/v1587394168/flapimas/flapimas-screen-3.jpg"/>
        </div>
        <div className="image-block-mobile">
            <img alt="flapimas game over" src="https://res.cloudinary.com/muniatu/image/upload/v1587394168/flapimas/flapimas-screen-4.jpg"/>
        </div>
        <div className="image-block-mobile">
            <img alt="flapimas video" src="https://res.cloudinary.com/muniatu/image/upload/v1587393395/flapimas/flapimas-optimal.gif"/>
        </div>
        <div className="rowfix"></div>
      </div>
    </React.Fragment>
  )
}
