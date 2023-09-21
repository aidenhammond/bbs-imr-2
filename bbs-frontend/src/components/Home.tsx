import React, { useEffect, useState, useRef } from 'react';
import "../styles/Home.css"
import Earth from "../assets/earth.png" 
import memebeamer from "../assets/lil-meme.png"
import MeetTheTeam from './Home/MeetTheTeam';

const Home: React.FC = () => {

  // Useless code
  // wanted to make the 'memesat-1' move to the center when scrolling down then like
  // stay with the page as we talked about stuff when you scroll down? idk.
  /*const [originalPosition, setOriginalPosition] = useState<{ top: number, left: number } | null>(null);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const targetElement = document.getElementById('MEMESat-title') as HTMLHeadingElement;
    const rect = targetElement.getBoundingClientRect();
    if (targetElement && originalPosition === null) {
      setOriginalPosition({ top: targetElement.offsetTop, left: targetElement.offsetLeft });
    }

    const animate = () => {
      if (targetElement && originalPosition !== null) {
        const shouldMove = window.scrollY > 20 && !(targetElement.offsetLeft > window.innerWidth/2);
        if (shouldMove) {
          const newPosition = scrollY*5;
          targetElement.style.position = 'absolute';
          targetElement.style.left = `${newPosition}px`;
          console.log(newPosition); 
        }
      }
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [scrollDirection, originalPosition]);
  */

  return (
    <div className={"home"}>
      <div id="home-background" />
      {/*<div className="scroll-container">
        <div className="scroll-section" />
        <div className="scroll-section" />
  </div>*/}
      <h1 className="home-title" id="MEMESat-title">
        MEMESat-1 Bulletin Board
      </h1>
      {/*<h1 className='home-title' id={'bulletin-board'}>
        Bulletin Board
</h1>*/}
      <div className="earth" id="earth_img">
        <div className="orbit">
          <img src={memebeamer} className="moon" />
        </div>
      </div>
      <MeetTheTeam />
    </div>
  );
};

export const useScrollDirection = (): 'up' | 'down' => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const direction = currentScrollPosition > lastScrollPosition ? 'down' : 'up';

      setScrollDirection(direction);
      setLastScrollPosition(currentScrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPosition]);

  return scrollDirection;
};

export default Home;
