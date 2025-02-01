import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';

const LayoutWrapper = styled.div`
  background: var(--deep-ocean);
  min-height: 100vh;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: linear-gradient(
      180deg,
      var(--ocean-surface) 0%,
      var(--deep-ocean) 100%
    );
    opacity: 0.7;
    z-index: -2;
  }
`;

const WaveBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.1;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background: radial-gradient(
      circle at center,
      var(--aquamarine) 0%,
      transparent 50%
    );
    animation: wave 15s infinite linear;
  }

  &::after {
    animation-delay: -7.5s;
    opacity: 0.5;
  }
`;

const Bubbles = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

const Bubble = styled.div`
  position: absolute;
  background: radial-gradient(
    circle at center,
    rgba(0, 255, 202, 0.2) 0%,
    rgba(0, 255, 202, 0.1) 50%,
    transparent 100%
  );
  border-radius: 50%;
  animation: float ${props => props.duration}s infinite ease-in-out;
  left: ${props => props.left}%;
  bottom: -20px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  opacity: ${props => props.opacity};
`;

const Layout = ({ children }) => {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    size: Math.random() * 30 + 10,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    opacity: Math.random() * 0.5 + 0.1,
    delay: Math.random() * -15
  }));

  return (
    <LayoutWrapper>
      <WaveBackground />
      <Bubbles>
        {bubbles.map((bubble, i) => (
          <Bubble
            key={i}
            size={bubble.size}
            left={bubble.left}
            duration={bubble.duration}
            opacity={bubble.opacity}
            style={{ animationDelay: `${bubble.delay}s` }}
          />
        ))}
      </Bubbles>
      <Navigation />
      {children}
    </LayoutWrapper>
  );
};

export default Layout; 