import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '../Animation - 1738445922034.json';

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--deep-ocean);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LottieWrapper = styled(motion.div)`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const BrandText = styled(motion.div)`
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    var(--aquamarine) 0%,
    #00ffff 50%,
    #00bfff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 255, 202, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.1) 0%,
      transparent 70%
    );
    z-index: -1;
    animation: pulse 2s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 1; }
  }
`;

const EnterButton = styled(motion.button)`
  padding: 1rem 3rem;
  font-size: 1.25rem;
  background: transparent;
  border: 2px solid var(--aquamarine);
  color: var(--aquamarine);
  border-radius: 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.2) 0%,
      transparent 50%
    );
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
  }
  
  &:hover {
    background: rgba(0, 255, 202, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 255, 202, 0.2);
    
    &::before {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const LoadingScreen = ({ onComplete }) => {
  const [showBrand, setShowBrand] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBrand(true);
    }, 2000); // Reduced from 3000 to 2000 for faster response

    return () => clearTimeout(timer);
  }, []);

  const handleEnterClick = () => {
    setAnimationComplete(true);
    setTimeout(() => {
      onComplete();
    }, 500); // Reduced from 1000 to 500 for faster transition
  };

  return (
    <AnimatePresence>
      {!animationComplete && (
        <LoadingContainer
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Reduced from 1 to 0.5
        >
          <LottieWrapper
            initial={{ opacity: 1 }}
            animate={{ opacity: showBrand ? 0 : 1 }}
            transition={{ duration: 0.5 }} // Reduced from 1 to 0.5
          >
            <Lottie
              animationData={animationData}
              loop={false}
              style={{ width: '100%', height: '100%' }}
            />
          </LottieWrapper>
          
          {showBrand && (
            <BrandContainer>
              <BrandText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }} // Reduced durations
              >
                $AQUA
              </BrandText>
              <EnterButton
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }} // Reduced durations
                onClick={handleEnterClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter
              </EnterButton>
            </BrandContainer>
          )}
        </LoadingContainer>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen; 