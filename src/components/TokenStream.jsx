import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const StreamContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0B1E 0%, #1A1B3D 100%);
  padding: 2rem;
  overflow: hidden;
  position: relative;
`;

const FlowingBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238ab4ff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.5;
`;

const StreamPath = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
`;

const TokenCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(138, 180, 255, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      rgba(138, 180, 255, 0) 0%,
      rgba(138, 180, 255, 0.3) 50%,
      rgba(138, 180, 255, 0) 100%
    );
  }

  &:hover {
    border-color: rgba(138, 180, 255, 0.3);
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TokenImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #fff;
  font-weight: 600;
`;

const TokenSymbol = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const Metric = styled.div`
  position: relative;
  padding: 1rem;
  background: rgba(138, 180, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(138, 180, 255, 0.1);
  }
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.125rem;
  color: #fff;
  font-weight: 500;
`;

const PriceChange = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.positive ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 77, 77, 0.1)'};
  color: ${props => props.positive ? '#00ff9d' : '#ff4d4d'};
`;

const TokenStream = ({ tokens }) => {
  const [expandedToken, setExpandedToken] = useState(null);

  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  return (
    <StreamContainer>
      <FlowingBackground />
      <StreamPath>
        <AnimatePresence>
          {tokens.map((token, index) => (
            <TokenCard
              key={token.token.mint}
              layoutId={token.token.mint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setExpandedToken(expandedToken === token ? null : token)}
            >
              <TokenHeader>
                <TokenImage src={token.token.image} alt={token.token.name} />
                <TokenInfo>
                  <TokenName>{token.token.name}</TokenName>
                  <TokenSymbol>{token.token.symbol}</TokenSymbol>
                </TokenInfo>
                <PriceChange 
                  positive={token.events['24h']?.priceChangePercentage >= 0}
                >
                  {(token.events['24h']?.priceChangePercentage || 0).toFixed(2)}%
                </PriceChange>
              </TokenHeader>

              <MetricsContainer>
                <Metric>
                  <MetricLabel>Price</MetricLabel>
                  <MetricValue>
                    {formatNumber(token.pools[0]?.price?.usd || 0)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>Market Cap</MetricLabel>
                  <MetricValue>
                    {formatNumber(token.pools[0]?.marketCap?.usd || 0)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>Liquidity</MetricLabel>
                  <MetricValue>
                    {formatNumber(token.pools[0]?.liquidity?.usd || 0)}
                  </MetricValue>
                </Metric>
              </MetricsContainer>

              {expandedToken === token && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {/* Add expanded content here */}
                </motion.div>
              )}
            </TokenCard>
          ))}
        </AnimatePresence>
      </StreamPath>
    </StreamContainer>
  );
};

export default TokenStream; 