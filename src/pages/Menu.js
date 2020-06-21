import React from 'react';
import './menu.scss';
import '../index.scss';
import '../config.scss';
import MetaTags from 'react-meta-tags';
import {
    Link
  } from "react-router-dom";

export default () =>
    <div className="menu-wrapper">
        <MetaTags>
            <title>Adrià Compte | Personal Website</title>
            <meta name="description" content="Adrià Compte | Product Designer & Frontend Developer" />
            <meta property="og:title" content="Adrià Compte | Personal Website" />
        </MetaTags>
        <ul className="main-menu">
            <li>
                <Link to="/solojuegos">Solojuegos</Link>
            </li>
            <li>
                <Link to="/filehippo">Filehippo</Link>
            </li>
            <li>
                <Link to="/tokoro">Tokoro</Link>
            </li>
            <li>
                <Link to="/flapimas">Flapimas</Link>
            </li>
            <li>
                <Link to="/softonic-design-system">Softonic Design System</Link>
            </li>
        </ul>
    </div>;
