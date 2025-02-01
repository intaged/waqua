import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  color: white;
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TokenImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(138, 180, 255, 0.3);
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #fff, #8ab4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TokenSymbol = styled.div`
  color: rgba(255, 255, 255, 0.6);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled(motion.div)`
  background: rgba(138, 180, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(138, 180, 255, 0.2);

  &:hover {
    border-color: rgba(138, 180, 255, 0.4);
    background: rgba(138, 180, 255, 0.15);
  }
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const TokenDetails = ({ token }) => {
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
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TokenHeader>
        <TokenImage src={token.token.image} alt={token.token.name} />
        <TokenInfo>
          <TokenName>{token.token.name}</TokenName>
          <TokenSymbol>{token.token.symbol}</TokenSymbol>
        </TokenInfo>
      </TokenHeader>

      <StatsGrid>
        {[
          { label: 'Price', value: formatNumber(token.pools[0]?.price?.usd || 0) },
          { label: 'Market Cap', value: formatNumber(token.pools[0]?.marketCap?.usd || 0) },
          { label: '24h Change', value: `${(token.events['24h']?.priceChangePercentage || 0).toFixed(2)}%` },
          { label: 'Liquidity', value: formatNumber(token.pools[0]?.liquidity?.usd || 0) }
        ].map((stat, index) => (
          <StatItem
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
          </StatItem>
        ))}
      </StatsGrid>
    </Container>
  );
};

export default TokenDetails; 