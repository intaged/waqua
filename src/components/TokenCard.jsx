import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { subscribeToTokenUpdates } from '../services/api';
import TokenModal from './TokenModal';

const bubbleFloat = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.02); }
`;

const ripple = keyframes`
  0% { transform: scale(0.95); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
`;

const Card = styled(motion.div)`
  background: rgba(0, 27, 61, 0.4);
  border-radius: 24px;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 255, 202, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
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
      transparent 50%
    );
    transform: scale(0);
    transition: transform 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 255, 202, 0.3);
    box-shadow: 
      0 10px 20px rgba(0, 27, 61, 0.4),
      0 0 30px rgba(0, 255, 202, 0.1),
      inset 0 0 15px rgba(0, 255, 202, 0.05);

    &::before {
      transform: scale(1);
      animation: wave 10s infinite linear;
    }
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--aquamarine), var(--seafoam));
    border-radius: 50%;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${Card}:hover &::before {
    opacity: 1;
  }
`;

const TokenImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 255, 202, 0.1);
  position: relative;
  z-index: 1;
  animation: ${bubbleFloat} 3s ease-in-out infinite;
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h3`
  color: #fff;
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
  background: linear-gradient(45deg, #fff, var(--aquamarine));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TokenSymbol = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  background: rgba(0, 255, 202, 0.05);
  padding: 0.75rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(0, 255, 202, 0.08);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }
  }
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

const priceUpdate = keyframes`
  0% { background-color: rgba(0, 255, 202, 0.2); }
  100% { background-color: transparent; }
`;

const PriceValue = styled(StatValue)`
  animation: ${props => props.updated ? priceUpdate : 'none'} 1s ease-out;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 202, 0.2) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
  }

  ${StatItem}:hover &::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
`;

const TokenCard = ({ token, delay }) => {
  const [currentPrice, setCurrentPrice] = useState(token.pools[0]?.price?.usd || 0);
  const [priceUpdated, setPriceUpdated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToTokenUpdates(token.token.mint, (data) => {
      if (data.type === 'price' && data.token === token.token.mint) {
        setCurrentPrice(data.price);
        setPriceUpdated(true);
        setTimeout(() => setPriceUpdated(false), 1000);
      }
    });

    return () => unsubscribe();
  }, [token.token.mint]);

  const formatNumber = (num) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  return (
    <>
      <Card 
        delay={delay}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <TokenHeader>
          <ImageWrapper>
            <TokenImage src={token.token.image} alt={token.token.name} />
          </ImageWrapper>
          <TokenInfo>
            <TokenName>{token.token.name}</TokenName>
            <TokenSymbol>{token.token.symbol}</TokenSymbol>
          </TokenInfo>
        </TokenHeader>
        <StatsGrid>
          <StatItem>
            <StatLabel>Price</StatLabel>
            <PriceValue updated={priceUpdated}>
              {formatNumber(currentPrice)}
            </PriceValue>
          </StatItem>
          <StatItem>
            <StatLabel>Market Cap</StatLabel>
            <StatValue>
              {formatNumber(token.pools[0]?.marketCap?.usd || 0)}
            </StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>24h Change</StatLabel>
            <StatValue style={{ 
              color: token.events['24h']?.priceChangePercentage >= 0 
                ? '#00ff9d' 
                : '#ff4d4d' 
            }}>
              {(token.events['24h']?.priceChangePercentage || 0).toFixed(2)}%
            </StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Liquidity</StatLabel>
            <StatValue>
              {formatNumber(token.pools[0]?.liquidity?.usd || 0)}
            </StatValue>
          </StatItem>
        </StatsGrid>
      </Card>

      <TokenModal
        token={token}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default TokenCard; 