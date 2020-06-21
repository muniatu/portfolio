import React from 'react';
import 'typeface-pt-serif';
import MetaTags from 'react-meta-tags';

export default () =>
  <div className="article pt-xxxl pb-xxxl">
    <MetaTags>
      <title>Adrià Compte | Softonic Design System</title>
      <meta name="description" content="Softonic's design system creation process" />
      <meta property="og:title" content="Adrià Compte | Softonic Design System" />
    </MetaTags>
    <article className="article__content">
      <h1>Softonic Design System</h1>
      <h2>
        INTRODUCTION
      </h2>
      <p>
        After accumulating <strong>years of legacy design</strong> softonic.com had an evident 
        lack of consistency across the numerous UI components and it was clearly 
        affecting the appearance of the website, delaying design and harming development time.
      </p>
      <p>
        The product design team rarely was working as a whole, each member was enrolled in a 
        different agile team and even though sometimes they were working on the same project 
        (softonic.com), there was a fair lack of communication, each product manager's desire to 
        test new features, as fast as possible, had developers deploying new components without 
        even checking with the design team.
      </p>
      <br/>
      <h2>
        GOALS
      </h2>
      <p>
        I joined Softonic's product design team just when they had decided to put an end to 
        this and <strong>start building their own design system</strong>. The business was going well but the 
        effort had to be justified on the business side, so we set the following goals: 
      </p>
      <ol>
        <li>
          Build strong channels of communication between designers.
        </li>
        <li>
          Bring consistency to the design of our products.
        </li>
        <li>
          Have a shared vocabulary with developers and more accurate hand-offs.
        </li>
        <li>
          Decrease time to market for new features.
        </li>
      </ol>
      <p>
        As nobody in the team had worked on the development of a design system before, in each 
        step of the way, we had to do some research. After a fair amount of discussion we decided 
        to go with the book Design Systems: A practical guide to creating design languages for digital 
        products by Alla Kholmatova, as our bible.
      </p>
      <br/>
      <h2>
        PARAMETERS OF THE SYSTEM
      </h2>
      <p>
        We used the sets of rules as described in the book: strictness, modularity and distribution, 
        in order to understand better what were the needs of our team and the company itself.
      </p>
      <h4>
        <strong className="article__list-title">Strict vs loose:</strong>
      </h4>
      <ul>
        <li>
          We were taking our first steps with a design system so we needed to be flexible.
        </li>
        <li>
          We should be able to create new components based on stakeholder needs in an agile way.
        </li>
        <li>
          The system should become more strict as it matures.
        </li>
      </ul>
      <h4>
        <strong className="article__list-title">Modularity vs integrated:</strong>
      </h4>
      <ul>
        <li>
          We need to be agile and have different teams working in parallel.
        </li>
        <li>
          We will have to reuse components for different purposes.
        </li>
        <li>
          It has to be relatively easy to maintain.
        </li>
        <li>
          We have to be able to apply different patterns in order to test conversion as fast as possible.
        </li>
      </ul>
      <h4>
        <strong className="article__list-title">Centralized vs distributed:</strong>
      </h4>
      <ul>
        <li>
          Our team is small and centralized.
        </li>
        <li>
          We define the patterns and rules.
        </li>
        <li>
          We manage the assets and the tools to store them.
        </li>
      </ul>
      <br/>
      <h2>
        START OF THE DESIGN PROCESS
      </h2>
      <p>
        The first steps of the design process started as a way to keep the cohesion of the Product Design Team, 
        given each member was working in a different squad, it was a way to get together, align our vision and 
        work towards a common goal. Each member had their duties defined by a product manager but we reserved 
        some time to work on components individually.
      </p>
      <p>
        Luckily for us, four of our six designers were also front-end developers, so as the development team was migrating 
        the old components in <i>Nunjucks</i> to <i>Marko.js</i> we decided to conduct an <strong>interface inventory</strong> following the process 
        that explains <i>Brad Frost</i> in one of his <a href="https://bradfrost.com/blog/post/interface-inventory/" title="Brad Frost Interface Inventory" rel="noopener noreferrer nofollow" target="_blank">posts</a>. 
        In a small amount of time, we discovered a lot more inconsistencies than we expected.
      </p>
      <p>
        At this point, we were ready to start working with Sketch and creating all the symbols. For most of us, it was a 
        new experience, certainly time-consuming and sometimes even frustrating, but totally worth it.
      </p>
      <p>
        As our library was growing we realized we needed a proper naming system for our symbols, so we decided 
        to adopt something similar to BEM. This way we had similar structures to what we can see in front-end 
        development and shared a common language. Proper layering and defining the right symbol overrides was 
        also a big challenge.
      </p>
      <br/>
    </article>
    <section class="article__images">
      <img src="https://res.cloudinary.com/muniatu/image/upload/v1589148674/softonic-design-system/design-system-v1.png" alt="Softonic Design System" />
    </section>
    <article className="article__content">
      <br/>
      <h2>
        VERSION CONTROL
      </h2>
      <p>
        The Product Design team had been using <a href="https://www.crunchbase.com/organization/brand-ai#section-overview" title="brand.ai"rel="nofollow">brand.ai</a> (acquired by InVision later on) to store our design tokens and Google Drive to keep 
        all the Sketch files, project screenshots and documentation about research, but we really struggled to 
        have everything in sync, and most of the time, if one member of the team was missing for any reason, 
        nobody could follow up on their work because files weren't updated properly. At some point we realized that something
        wasn't working and we had to find a solution.
      </p>
      <p>
        I was assigned to find a new tool to keep the designs available for everyone at all times and have them as 
        updated as possible. After testing, reviewing, and presenting the benefits and drawbacks of tools such 
        as <a href="https://www.abstract.com/" title="abstract"rel="nofollow">Abstract</a>, <a href="https://plantapp.io/" title="Plant"rel="nofollow">Plant</a>, <a href="https://kactus.io/" title="Kactus"rel="nofollow">Kactus</a>, <a href="https://sympli.io/versions" title="versions"rel="nofollow">Versions by Sympli</a> or even raw <a href="https://medium.com/@Designforventures.co/using-bitbucket-together-with-sketch-files-4bd842f86775" title="Bitbucket for designers"rel="nofollow">Bitbucket</a>. 
        We decided to go with Versions, as it was free, it linked with our Bitbucket storage, had updates consistently and did exactly what we needed, 
        not less not more. It actually became a game-changer for all of us.
      </p>
      <br/>
    </article>
    <section class="article__images">
      <img src="https://res.cloudinary.com/muniatu/image/upload/v1589150189/softonic-design-system/versions1.png" alt="Softonic Design System" />
      <img src="https://res.cloudinary.com/muniatu/image/upload/v1589150189/softonic-design-system/versions2.png" alt="Softonic Design System" />
    </section>
    <article className="article__content">
      <br/>
      <h2>
        WHITE LABELS & STORYBOOK
      </h2>
      <p>
        During 2019 Softonic partnered with Filehippo and Digital Trends to maintain, scale and develop their 
        software download businesses. In Filehippo's case, we mainly refactored all their front-end and added our 
        ad stack, for Digital Trends we created a new product from scratch. 
      </p>
      <p>
        Both of these new products are using <a href="https://markojs.com/" rel="nofollow"><i>Marko.js</i></a>, the same 
        front-end framework as our main product, softonic.com. 
        From the development team arose the need to have a library of components that could be shared between projects, 
        as most of them were practically the same but with different styles. So we started creating a set of agreements 
        and developing the first components using Storybook.
      </p>
      <p>
        The initial intention was to create agnostic components with common variables and then apply a different theme 
        for each specific product, similar to what <a href="https://www.carbondesignsystem.com/guidelines/themes/" rel="nofollow">IBM Carbon's desing system</a> does. 
        The theory sounds great but there wasn't a team exclusively dedicated to this and when different projects are 
        growing at a different pace, in separate teams, with different product needs it becomes really hard to stay on the same page.
      </p>
      <p>
        By the end of 2019, the company went through some difficulties and the project was semi-abandoned, but we set 
        a really good foundation for the future.
      </p>
      <br/>
    </article>
    <section class="article__images">
      <img src="https://res.cloudinary.com/muniatu/image/upload/v1592781753/softonic-design-system/softonic-white-label.png" alt="Softonic White Label" />
      <img src="https://res.cloudinary.com/muniatu/image/upload/v1592781756/softonic-design-system/flipo-white-label.png" alt="Filehippo White Label" />
      <img src="https://res.cloudinary.com/muniatu/image/upload/v1592781758/softonic-design-system/dt-white-label.png" alt="Digital Trends White Label" />
    </section>
    <article className="article__content">
      <h2>
        RESPONSIVE
      </h2>
      <p>
        From the start of 2020, as Google mobile-first indexing rolled out in September of that year, we started working 
        on the transition from an adaptive website to a fully responsive one. Before this transition, mobile and desktop 
        sites were treated as separate products as the monetization models were quite different in each platform. 
      </p>
      <p>
        Softonic.com relies heavily on SEO so having a responsive site became a priority and a big part of the Product Design Team, 
        working tightly with front-end developers, was put in charge to refactor the layout of all the pages and most of the components 
        of the site. It was the perfect chance to get back to working on the design system and publishing components to Storybook. 
        An end-to-end process where I had a relevant role.
      </p>
      <br/>
    </article>
  </div>;