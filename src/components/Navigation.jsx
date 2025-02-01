import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${props => props.scrolled 
    ? 'rgba(0, 27, 61, 0.8)' 
    : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      rgba(0, 255, 202, 0) 0%,
      rgba(0, 255, 202, ${props => props.scrolled ? '0.2' : '0'}) 50%,
      rgba(0, 255, 202, 0) 100%
    );
    transition: all 0.3s ease;
  }
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    var(--aquamarine) 0%,
    #00ffff 50%,
    #00bfff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  padding: 0.5rem;
  letter-spacing: 1px;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    width: 12px;
    height: 12px;
    background: var(--aquamarine);
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 
      0 0 15px var(--aquamarine),
      0 0 30px var(--aquamarine);
    animation: pulse 2s infinite ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--aquamarine),
      transparent
    );
    animation: shimmer 3s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.6; }
    50% { transform: translateY(-50%) scale(1.2); opacity: 1; }
  }

  @keyframes shimmer {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`;

const NavActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const TokenButton = styled.button`
  background: rgba(0, 255, 202, 0.1);
  border: 1px solid rgba(0, 255, 202, 0.2);
  color: var(--aquamarine);
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.2) 0%,
      transparent 50%
    );
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
  }
  
  &:hover {
    background: rgba(0, 255, 202, 0.15);
    border-color: rgba(0, 255, 202, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 202, 0.2);
    
    &::before {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const SocialIcon = styled.a`
  color: var(--aquamarine);
  font-size: 1.25rem;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    opacity: 1;
    transform: translateY(-2px);
    
    &::before {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTokens = () => {
    const tokensSection = document.getElementById('tokens-section');
    if (tokensSection) {
      tokensSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavContainer scrolled={scrolled}>
      <Logo>$AQUA</Logo>
      <NavActions>
        <TokenButton onClick={scrollToTokens}>Tokens</TokenButton>
        <SocialIcons>
          <SocialIcon href="https://x.com/AQUASOLSOL" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </SocialIcon>
          <SocialIcon href="https://t.me/AQUASOLANAA" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
            </svg>
          </SocialIcon>
        </SocialIcons>
      </NavActions>
    </NavContainer>
  );
};

export default Navigation; 