import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PriceChart from './PriceChart';

const DashboardContainer = styled.div`
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%,
      rgba(0, 255, 202, 0.03) 0%,
      rgba(0, 77, 104, 0.01) 50%,
      rgba(0, 27, 61, 0) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 27, 61, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 202, 0.1);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

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
    animation: wave 15s infinite linear;
    pointer-events: none;
  }
`;

const BubbleButton = styled(motion.button)`
  background: rgba(0, 255, 202, 0.1);
  border: 1px solid rgba(0, 255, 202, 0.2);
  color: var(--aquamarine);
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  font-weight: 500;
  backdrop-filter: blur(5px);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
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
    background: rgba(0, 255, 202, 0.15);
    border-color: rgba(0, 255, 202, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 202, 0.2);

    &::before {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  ${props => props.active && `
    background: rgba(0, 255, 202, 0.2);
    border-color: rgba(0, 255, 202, 0.4);
    box-shadow: 0 0 20px rgba(0, 255, 202, 0.2);
  `}
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(0, 27, 61, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 255, 202, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

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
    transform: translateY(-5px);
    border-color: rgba(0, 255, 202, 0.3);
    box-shadow: 0 10px 20px rgba(0, 27, 61, 0.4),
                0 0 30px rgba(0, 255, 202, 0.1);

    &::before {
      transform: scale(1);
      animation: wave 10s infinite linear;
    }
  }
`;

const TimeframeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20%;
    right: -20%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 255, 202, 0.2) 50%,
      transparent 100%
    );
  }
`;

const MetricValue = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: ${props => props.positive ? '#00ffaa' : props.negative ? '#ff4d4d' : '#fff'};
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartContainer = styled(motion.div)`
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;

  ${Card}:hover & {
    height: 150px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TokenIcon = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 1px;
    background: linear-gradient(135deg, rgba(138, 180, 255, 0.5), rgba(138, 180, 255, 0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
`;

const Stat = styled.div`
  background: rgba(138, 180, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(138, 180, 255, 0.1);
  }
`;

const PriceChangeIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: ${props => props.positive ? 'rgba(0, 255, 170, 0.1)' : 'rgba(255, 77, 77, 0.1)'};
  border: 1px solid ${props => props.positive ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255, 77, 77, 0.2)'};
`;

const IndicatorIcon = styled.span`
  font-size: 0.875rem;
  color: ${props => props.positive ? '#00ffaa' : '#ff4d4d'};
`;

const CryptoDashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [activeView, setActiveView] = useState('overview');
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState({});

  const timeframes = [
    { label: '24H', value: '24h' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' }
  ];

  const views = [
    { label: 'Overview', value: 'overview' },
    { label: 'Markets', value: 'markets' },
    { label: 'Analytics', value: 'analytics' }
  ];

  // Update simulated data with Solana
  useEffect(() => {
    // Simulated metrics data
    setMetrics([
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 48235.67,
        change: 2.45,
        marketCap: 925.8,
        volume: 32.5,
        icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        color: '#F7931A'
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        price: 2890.12,
        change: -1.23,
        marketCap: 345.2,
        volume: 18.7,
        icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        color: '#627EEA'
      },
      {
        name: 'Solana',
        symbol: 'SOL',
        price: 98.45,
        change: 5.67,
        marketCap: 42.3,
        volume: 8.9,
        icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        color: '#14F195'
      }
    ]);

    // Generate more realistic chart data
    const generateChartData = (timeframe, trend = 'neutral') => {
      const points = timeframe === '24h' ? 24 : timeframe === '1w' ? 7 : 30;
      const data = [];
      let price = 45000;
      const volatility = 0.02; // 2% volatility
      const trendFactor = trend === 'up' ? 0.003 : trend === 'down' ? -0.003 : 0;
      
      for (let i = 0; i < points; i++) {
        const randomChange = (Math.random() - 0.5) * volatility;
        price = price * (1 + randomChange + trendFactor);
        data.push({
          time: timeframe === '24h' 
            ? `${i}:00`
            : timeframe === '1w'
            ? `Day ${i + 1}`
            : `Day ${i + 1}`,
          price
        });
      }
      return data;
    };

    setChartData({
      '24h': {
        BTC: generateChartData('24h', 'up'),
        ETH: generateChartData('24h', 'down'),
        SOL: generateChartData('24h', 'up')
      },
      '1w': {
        BTC: generateChartData('1w', 'up'),
        ETH: generateChartData('1w', 'neutral'),
        SOL: generateChartData('1w', 'up')
      },
      '1m': {
        BTC: generateChartData('1m', 'up'),
        ETH: generateChartData('1m', 'up'),
        SOL: generateChartData('1m', 'up')
      }
    });
  }, []);

  return (
    <DashboardContainer>
      <NavBar>
        {views.map(view => (
          <BubbleButton
            key={view.value}
            active={activeView === view.value}
            onClick={() => setActiveView(view.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {view.label}
          </BubbleButton>
        ))}
      </NavBar>

      <TimeframeSelector>
        {timeframes.map(tf => (
          <BubbleButton
            key={tf.value}
            active={activeTimeframe === tf.value}
            onClick={() => setActiveTimeframe(tf.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tf.label}
          </BubbleButton>
        ))}
      </TimeframeSelector>

      <GridContainer>
        <AnimatePresence>
          {metrics.map((metric, index) => (
            <Card
              key={metric.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardHeader>
                <TokenInfo>
                  <TokenIcon src={metric.icon} alt={metric.name} />
                  <div>
                    <MetricLabel>{metric.name}</MetricLabel>
                    <MetricValue>{metric.symbol}</MetricValue>
                  </div>
                </TokenInfo>
                <PriceChangeIndicator 
                  positive={metric.change > 0}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <IndicatorIcon positive={metric.change > 0}>
                    {metric.change > 0 ? '↑' : '↓'}
                  </IndicatorIcon>
                  <MetricValue positive={metric.change > 0} negative={metric.change < 0}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </MetricValue>
                </PriceChangeIndicator>
              </CardHeader>

              <StatsGrid>
                <Stat>
                  <MetricLabel>Price</MetricLabel>
                  <MetricValue>${metric.price.toLocaleString()}</MetricValue>
                </Stat>
                <Stat>
                  <MetricLabel>Market Cap</MetricLabel>
                  <MetricValue>${metric.marketCap}B</MetricValue>
                </Stat>
                <Stat>
                  <MetricLabel>Volume (24h)</MetricLabel>
                  <MetricValue>${metric.volume}B</MetricValue>
                </Stat>
              </StatsGrid>

              <ChartContainer
                initial={{ height: 0 }}
                animate={{ height: 150 }}
                transition={{ duration: 0.3 }}
              >
                {chartData[activeTimeframe] && (
                  <PriceChart
                    data={chartData[activeTimeframe][metric.symbol]}
                    timeframe={activeTimeframe}
                    color={metric.color}
                  />
                )}
              </ChartContainer>
            </Card>
          ))}
        </AnimatePresence>
      </GridContainer>
    </DashboardContainer>
  );
};

export default CryptoDashboard; 