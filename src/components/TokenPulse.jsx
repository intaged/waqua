import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const PulseContainer = styled.div`
  min-height: 100vh;
  background: #050714;
  position: relative;
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, 
    rgba(138, 180, 255, 0.03) 0%,
    rgba(88, 101, 242, 0.01) 50%,
    rgba(10, 11, 30, 0) 100%
  );
  pointer-events: none;
`;

const SectionHeader = styled.div`
  max-width: 1800px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;
  
  h2 {
    font-size: 2.5rem;
    background: linear-gradient(45deg, #fff, #8ab4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.125rem;
    max-width: 600px;
    line-height: 1.6;
  }
`;

const CategorySection = styled.section`
  margin-bottom: 4rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PulseCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 24px;
  background: rgba(20, 22, 44, 0.6);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  will-change: transform;
  contain: layout style paint;
  transform: translateZ(0);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0%,
      ${props => props.pulseColor || '#8ab4ff'} 5%,
      transparent 10%
    );
    animation: rotate 4s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.1;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const TokenImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;

  ${PulseCard}:hover & {
    transform: scale(1.05);
  }
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #fff, #8ab4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TokenSymbol = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  letter-spacing: 0.5px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: auto;
`;

const Metric = styled.div`
  background: rgba(138, 180, 255, 0.05);
  padding: 1.25rem;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(138, 180, 255, 0.05) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: translateX(100%);
  }

  ${PulseCard}:hover & {
    background: rgba(138, 180, 255, 0.08);
  }
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
  font-size: 1.125rem;
  color: #fff;
  font-weight: 500;
`;

const PulseRing = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 1px solid ${props => props.color};
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const TimeframeSwitcher = styled(motion.div)`
  position: relative;
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: rgba(20, 22, 44, 0.4);
  border-radius: 24px;
  margin-bottom: 2rem;
`;

const TimeframeButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
`;

const ActiveBackground = styled(motion.div)`
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  background: linear-gradient(135deg, rgba(138, 180, 255, 0.2), rgba(88, 101, 242, 0.2));
  border: 1px solid rgba(138, 180, 255, 0.1);
  border-radius: 18px;
  z-index: 1;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 7, 20, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(138, 180, 255, 0.1);
  border-top-color: #8ab4ff;
  border-radius: 50%;
`;

const TopBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #000;
  z-index: 2;
`;

const TokenPulse = ({ tokens }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [graduatedTimeframe, setGraduatedTimeframe] = useState('24h');
  
  const timeframes = [
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '24h', value: '24h' }
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [activeTimeframeIndex, setActiveTimeframeIndex] = useState(2); // Default to 24h (index 2)

  // Memoize the token filtering and sorting logic
  const { graduatedTokens, trendingTokens } = useMemo(() => {
    if (!Array.isArray(tokens)) return { graduatedTokens: [], trendingTokens: [] };

    // Create a Set to track unique token addresses
    const processedTokens = new Set();

    const validTokens = tokens.filter(token => {
      if (!token?.token?.mint || !token.events || !token.pools?.[0]) return false;
      
      // Check if we've already processed this token
      if (processedTokens.has(token.token.mint)) return false;
      
      // Add token to processed set
      processedTokens.add(token.token.mint);
      return true;
    });

    // For graduated tokens, sort by market cap and minimum liquidity requirements
    const graduated = validTokens
      .filter(token => {
        const liquidityUsd = token.pools[0]?.liquidity?.usd || 0;
        const marketCapUsd = token.pools[0]?.marketCap?.usd || 0;
        return (
          liquidityUsd >= 50000 && // Minimum liquidity requirement
          marketCapUsd >= 100000 && // Minimum market cap requirement
          !token.risk?.rugged && // Exclude rugged tokens
          token.pools[0]?.price?.usd > 0 // Ensure token has a valid price
        );
      })
      .sort((a, b) => {
        // Primary sort by market cap
        const marketCapDiff = (b.pools[0]?.marketCap?.usd || 0) - (a.pools[0]?.marketCap?.usd || 0);
        if (marketCapDiff !== 0) return marketCapDiff;
        
        // Secondary sort by liquidity
        return (b.pools[0]?.liquidity?.usd || 0) - (a.pools[0]?.liquidity?.usd || 0);
      })
      .slice(0, 6);

    // Ensure we always have 6 slots for graduated tokens
    const graduatedWithPlaceholders = [...graduated];
    while (graduatedWithPlaceholders.length < 6) {
      graduatedWithPlaceholders.push(null);
    }

    // For trending tokens, sort by transaction volume and price impact
    const trending = validTokens
      .filter(token => {
        const liquidityUsd = token.pools[0]?.liquidity?.usd || 0;
        return (
          liquidityUsd >= 10000 && // Minimum liquidity for trending
          !token.risk?.rugged && // Exclude rugged tokens
          token.pools[0]?.price?.usd > 0 // Ensure token has a valid price
        );
      })
      .sort((a, b) => {
        const aTxns = (a.buys || 0) + (a.sells || 0);
        const bTxns = (b.buys || 0) + (b.sells || 0);
        const aChange = Math.abs(a.events?.[selectedTimeframe]?.priceChangePercentage || 0);
        const bChange = Math.abs(b.events?.[selectedTimeframe]?.priceChangePercentage || 0);
        // Combine transaction count and price impact for trending score
        const trendingScoreDiff = (bTxns * bChange) - (aTxns * aChange);
        if (trendingScoreDiff !== 0) return trendingScoreDiff;
        
        // Secondary sort by market cap
        return (b.pools[0]?.marketCap?.usd || 0) - (a.pools[0]?.marketCap?.usd || 0);
      })
      .slice(0, 6);

    // Ensure we always have 6 slots for trending tokens
    const trendingWithPlaceholders = [...trending];
    while (trendingWithPlaceholders.length < 6) {
      trendingWithPlaceholders.push(null);
    }

    return { 
      graduatedTokens: graduatedWithPlaceholders, 
      trendingTokens: trendingWithPlaceholders 
    };
  }, [tokens, selectedTimeframe]);

  // Memoize the formatNumber function
  const formatNumber = useCallback((num) => {
    if (!num) return '$0';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  }, []);

  // Memoize the card rendering function
  const TokenCard = useCallback(({ token, index, showTopBadge, timeframe }) => {
    // If token is null, render an empty placeholder card
    if (!token) {
      return (
        <PulseCard
          layoutId={`empty-${index}`}
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: index * 0.05 }}
          style={{ background: 'rgba(20, 22, 44, 0.3)' }}
        />
      );
    }

    const priceChange = token.events?.[timeframe]?.priceChangePercentage || 0;
    const pulseColor = priceChange >= 0 ? '#00ff9d' : '#ff4d4d';

    return (
      <PulseCard
        layoutId={token.token.mint || index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        pulseColor={pulseColor}
      >
        {showTopBadge && index < 3 && (
          <TopBadge>Top {index + 1}</TopBadge>
        )}
        <TokenHeader>
          <TokenImage 
            src={token.token.image || '/placeholder-token.png'}
            alt={token.token.name || 'Token'}
            loading="lazy" // Add lazy loading
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-token.png';
            }}
          />
          <TokenInfo>
            <TokenName>{token.token.name || 'Unknown Token'}</TokenName>
            <TokenSymbol>{token.token.symbol || '--'}</TokenSymbol>
          </TokenInfo>
        </TokenHeader>

        <MetricsGrid>
          <Metric>
            <MetricLabel>Market Cap</MetricLabel>
            <MetricValue>
              {formatNumber(token.pools?.[0]?.marketCap?.usd || 0)}
            </MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>Liquidity</MetricLabel>
            <MetricValue>
              {formatNumber(token.pools?.[0]?.liquidity?.usd || 0)}
            </MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>{timeframe} Change</MetricLabel>
            <MetricValue style={{ color: priceChange >= 0 ? '#00ff9d' : '#ff4d4d' }}>
              {priceChange.toFixed(2)}%
            </MetricValue>
          </Metric>
        </MetricsGrid>

        <PulseRings pulseColor={pulseColor} />
      </PulseCard>
    );
  }, [formatNumber]);

  // Separate PulseRings component for better performance
  const PulseRings = React.memo(({ pulseColor }) => (
    <>
      {[40, 60, 80].map((size, i) => (
        <PulseRing
          key={size}
          size={size}
          color={pulseColor}
          initial={{ opacity: 0.2, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
          }}
        />
      ))}
    </>
  ));

  // Optimize grid rendering
  const renderTokenGrid = useCallback((tokenList, showTopBadges = false, timeframe = '24h') => (
    <Grid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {tokenList.map((token, index) => (
          <TokenCard
            key={token.token.mint || index}
            token={token}
            index={index}
            showTopBadge={showTopBadges}
            timeframe={timeframe}
          />
        ))}
      </AnimatePresence>
    </Grid>
  ), []);

  const handleTimeframeChange = async (timeframe, index) => {
    setIsLoading(true);
    setActiveTimeframeIndex(index);
    setSelectedTimeframe(timeframe);
    
    // Simulate loading for smooth transition
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsLoading(false);
  };

  // Update the section header to include the new timeframe switcher
  const renderSectionHeader = (title, description, currentTimeframe, onTimeframeChange) => (
    <SectionHeader>
      <h2>{title}</h2>
      <p>{description}</p>
      <LayoutGroup>
        <TimeframeSwitcher layout>
          <ActiveBackground
            layout
            initial={false}
            animate={{
              x: activeTimeframeIndex * (100 / timeframes.length) + '%',
              width: `${100 / timeframes.length - 4}%`
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          />
          {timeframes.map(({ label, value }, index) => (
            <TimeframeButton
              key={value}
              active={currentTimeframe === value}
              onClick={() => onTimeframeChange(value, index)}
              layout
            >
              {label}
            </TimeframeButton>
          ))}
        </TimeframeSwitcher>
      </LayoutGroup>
    </SectionHeader>
  );

  return (
    <PulseContainer>
      <GradientOverlay />
      
      <CategorySection id="tokens-section">
        {renderSectionHeader(
          "Trending Now",
          "Most active tokens by transaction volume and price impact",
          selectedTimeframe,
          handleTimeframeChange
        )}
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </LoadingOverlay>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTimeframe}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderTokenGrid(trendingTokens, true, selectedTimeframe)}
          </motion.div>
        </AnimatePresence>
      </CategorySection>

      <CategorySection>
        {renderSectionHeader(
          "Graduated Tokens",
          "Established tokens with proven liquidity and market presence",
          graduatedTimeframe,
          (timeframe, index) => {
            setGraduatedTimeframe(timeframe);
            setActiveTimeframeIndex(index);
          }
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={graduatedTimeframe}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderTokenGrid(graduatedTokens, true, graduatedTimeframe)}
          </motion.div>
        </AnimatePresence>
      </CategorySection>
    </PulseContainer>
  );
};

// Add memo to prevent unnecessary re-renders
export default React.memo(TokenPulse); 