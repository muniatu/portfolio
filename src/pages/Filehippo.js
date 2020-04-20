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
        <title>Adrià Compte | Filehippo Design Concepts</title>
        <meta name="description" content="Design concepts for filehippo and softonic" />
        <meta property="og:title" content="Adrià Compte | Filehippo Design Concepts" />
      </MetaTags>
      <div className="flex-page-wrapper">
        <article className="main-text">
          <div>
            <h1>Filehippo Redesign</h1>
            <h2 className="filehippo-subtitle">Design Concepts</h2>
            <p>
              FileHippo is part of the Softonic’s product family and our Product 
              Design team was asked to deliver a few design concepts to showcase 
              how we could work on improving the overall look and feel of the website.
            </p>
            <p>
              The majority of the elements, monetization model and data structure is 
              very similar to softonic.com, so to me, it felt like the perfect chance 
              to try a different approach to all I had been working on during the previous months.
            </p>
            <p>
              My aim was to try a layout approach similar to the one that can be seen in apkpure.com, 
              one of our direct competitors which is more focused on mobile, as mobile has always been 
              one of the pain points of Softonic’s websites.
            </p>
            <p>
              In the end, I used the same design with two different brandings to see how it would fit, 
              and although the available budget at that moment didn’t allow us to explore further on 
              the concept, these mockups were used later on as inspiration to revise softonic.com's 
              design system in order to transition from an adaptive website to a responsive ecosystem.
            </p>
          </div>
        </article>
        <div className="image-block">
          <img alt="solojuegos article page" src="https://res.cloudinary.com/muniatu/image/upload/v1587332401/filehippo/filehippo-concept.jpg"/>
        </div>
        <div className="image-block">
          <img alt="solojuegos home" src="https://res.cloudinary.com/muniatu/image/upload/v1587332401/filehippo/softonic-concept.jpg"/>
        </div>
        <div className="rowfix"></div>
      </div>
    </React.Fragment>
  )
}
