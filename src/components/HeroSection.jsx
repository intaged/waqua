import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

const ripple = keyframes`
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(2); opacity: 0; }
`;

const bubbleRise = keyframes`
  0% { transform: translateY(100vh) scale(1); }
  50% { transform: translateY(50vh) scale(1.2); }
  100% { transform: translateY(-20vh) scale(1); }
`;

const HeroContainer = styled.section`
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    var(--deep-ocean) 0%,
    var(--ocean-surface) 100%
  );
`;

const OceanOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 255, 202, 0.05) 0%,
    rgba(0, 77, 104, 0.02) 50%,
    rgba(0, 27, 61, 0) 100%
  );
  pointer-events: none;
`;

const CoralReef = styled.div`
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  height: 300px;
  background: url('/coral-reef.png') repeat-x bottom center;
  background-size: contain;
  opacity: 0.6;
  animation: ${sway} 8s ease-in-out infinite;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--deep-ocean)
    );
  }
`;

const Bubbles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Bubble = styled.div`
  position: absolute;
  background: radial-gradient(
    circle at center,
    rgba(0, 255, 202, 0.4) 0%,
    rgba(0, 255, 202, 0.1) 50%,
    transparent 100%
  );
  border-radius: 50%;
  animation: ${bubbleRise} ${props => props.duration}s linear infinite;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  opacity: ${props => props.opacity};
  animation-delay: ${props => props.delay}s;
`;

const RippleEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(0, 255, 202, 0.2);
  border-radius: 50%;
  animation: ${ripple} 4s linear infinite;
  pointer-events: none;
`;

const ContentWrapper = styled(motion.div)`
  text-align: center;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.1) 0%,
      transparent 70%
    );
    animation: ${float} 6s ease-in-out infinite;
    pointer-events: none;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    45deg,
    #fff 0%,
    var(--aquamarine) 50%,
    #00bfff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(0, 255, 202, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
  text-shadow: 0 0 10px rgba(0, 255, 202, 0.2);
`;

const CTAButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(
    45deg,
    var(--aquamarine) 0%,
    #00bfff 100%
  );
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 255, 202, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 255, 202, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 50%
    );
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const HeroSection = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        left: Math.random() * 100,
        duration: Math.random() * 8 + 4,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1
      }));
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  const scrollToTokens = () => {
    const tokensSection = document.getElementById('tokens-section');
    if (tokensSection) {
      tokensSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <HeroContainer>
      <OceanOverlay />
      <CoralReef />
      <Bubbles>
        {bubbles.map(bubble => (
          <Bubble
            key={bubble.id}
            size={bubble.size}
            left={bubble.left}
            duration={bubble.duration}
            delay={bubble.delay}
            opacity={bubble.opacity}
          />
        ))}
      </Bubbles>
      <RippleEffect />
      <ContentWrapper
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Track the Future of Digital Assets</Title>
        <Subtitle>
          Real-time insights and analytics for the most promising tokens in the digital economy
        </Subtitle>
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTokens}
        >
          Explore Tokens
        </CTAButton>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection; 