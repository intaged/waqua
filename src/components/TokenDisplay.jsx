import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TokenCard from './TokenCard';
import TokenGrid from './TokenGrid';
import { fetchGraduatedTokens, fetchTrendingTokens } from '../services/api';

const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, #1A1B3D 0%, #0A0B1E 100%);
  z-index: -1;
  transform: translateY(${props => props.offset * 0.5}px);
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 5rem 1rem 1rem;
  }
`;

const GlowingOrb = styled.div`
  position: fixed;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at center,
    rgba(138, 180, 255, 0.1) 0%,
    rgba(138, 180, 255, 0) 70%
  );
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  transition: all 0.3s ease;
  transform: translate(${props => props.x}px, ${props => props.y}px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s ease forwards;
  
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(138, 180, 255, 0.5);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(138, 180, 255, 0.8) 0%,
      rgba(138, 180, 255, 0) 100%
    );
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 12px;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'rgba(138, 180, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-weight: 500;

  &:hover {
    background: rgba(138, 180, 255, 0.1);
  }
`;

const TokenDisplay = () => {
  const [activeTab, setActiveTab] = useState('graduated');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX - 150,
        y: e.clientY - 150
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const data = activeTab === 'graduated' 
          ? await fetchGraduatedTokens()
          : await fetchTrendingTokens();
        setTokens(data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
      setLoading(false);
    };

    fetchTokens();
  }, [activeTab]);

  return (
    <>
      <ParallaxBackground offset={scrollY} />
      <GlowingOrb x={mousePos.x} y={mousePos.y} />
      <Container>
        <Header>
          <Title>Solana Tokens</Title>
          <TabContainer>
            <Tab 
              active={activeTab === 'graduated'} 
              onClick={() => setActiveTab('graduated')}
            >
              Graduated
            </Tab>
            <Tab 
              active={activeTab === 'trending'} 
              onClick={() => setActiveTab('trending')}
            >
              Trending
            </Tab>
          </TabContainer>
        </Header>
        <TokenGrid loading={loading}>
          {tokens.map((token, index) => (
            <TokenCard 
              key={token.token.mint} 
              token={token}
              delay={index * 0.1}
            />
          ))}
        </TokenGrid>
      </Container>
    </>
  );
};

export default TokenDisplay; 