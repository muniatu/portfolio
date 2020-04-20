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
                <title>Adrià Compte | Solojuegos Design Concepts</title>
                <meta name="description" content="Design concepts for solojuegos and ongames" />
                <meta property="og:title" content="Adrià Compte | Solojuegos Design Concepts" />
            </MetaTags>
            <div className="flex-page-wrapper">
                <article className="main-text">
                    <div>
                        <h1>Solojuegos Redesign</h1>
                        <h2 className="solojuegos-subtitle">Market Research and Design Concepts</h2>
                        <p>
                            One of Softonic’s biggest sources of organic traffic is free 
                            videogame downloads, through an extensive survey on the website, 
                            we identified a huge demographic of young users looking for gaming 
                            content, especially free games.
                        </p>
                        <p>
                            Currently, users looking for games land in the same funnel as any 
                            other user looking for software and it feels like a specific 
                            experience for gaming would make a lot of sense, so I decided 
                            to work on a concept for solojuegos.com and ongames.com, domains 
                            owned by Softonic that currently are not being used. 
                            The theme was free-to-play games.
                        </p>
                        <p>
                            The idea is to have a better showcase for all the information 
                            related to games that we already have on our site. Including news, 
                            guides, game offers, free downloands and even free online games. 
                            During the past years, the free-to-play market has seen great expansion 
                            and for example, one of the most visited pages in softonic.com during 
                            2019 was the Apex Legends program page.
                        </p>
                        <p>
                            Providing a better experience to these types of users could 
                            potentially lead to better engagement and the ability to 
                            specifically work in a market focused on affiliation, a side of 
                            the business Softonic is trying to have more presence on.
                        </p>
                        
                    </div>
                </article>
                <div className="image-block">
                    <img alt="solojuegos home" src="https://res.cloudinary.com/muniatu/image/upload/v1586871907/solojuegos/solojuegos-home.jpg"/>
                </div>
                <div className="image-block">
                    <img alt="solojuegos article page" src="https://res.cloudinary.com/muniatu/image/upload/v1587328984/solojuegos/solojuegos-article.jpg"/>
                </div>
                <div className="image-block">
                    <img alt="solojuegos category page" src="https://res.cloudinary.com/muniatu/image/upload/v1587328331/solojuegos/solojuegos-category.jpg"/>
                </div>
                <div className="image-block">
                    <img alt="solojuegos game page" src="https://res.cloudinary.com/muniatu/image/upload/v1587328331/solojuegos/solojuegos-app-page.jpg"/>
                </div>
                <div className="image-block">
                    <img alt="solojuegos hardware page" src="https://res.cloudinary.com/muniatu/image/upload/v1587328331/solojuegos/solojuegos-hardware.jpg"/>
                </div>
                <div className="rowfix"></div>
            </div>
        </React.Fragment>
    )
}
