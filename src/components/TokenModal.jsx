import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 27, 61, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(0, 27, 61, 0.95) 0%,
    rgba(0, 27, 61, 0.85) 100%
  );
  border-radius: 24px;
  border: 1px solid rgba(0, 255, 202, 0.2);
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 202, 0.3),
      transparent
    );
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: var(--aquamarine);
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid rgba(0, 255, 202, 0.2);
    transition: all 0.3s ease;
  }

  &:hover {
    color: #fff;
    &::before {
      transform: scale(1.2);
      border-color: rgba(0, 255, 202, 0.4);
    }
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TokenIcon = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(0, 255, 202, 0.1);
  padding: 4px;
  border: 1px solid rgba(0, 255, 202, 0.2);
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h2`
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(
    135deg,
    var(--aquamarine) 0%,
    #00ffff 50%,
    #00bfff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const TokenSymbol = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(0, 255, 202, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 255, 202, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 202, 0.08);
    border-color: rgba(0, 255, 202, 0.2);
    transform: translateY(-2px);
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
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  background: rgba(0, 27, 61, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 255, 202, 0.1);
  margin-top: 2rem;
  height: 300px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TimeframeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeframeButton = styled.button`
  background: ${props => props.active ? 'rgba(0, 255, 202, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(0, 255, 202, 0.3)' : 'rgba(0, 255, 202, 0.1)'};
  color: ${props => props.active ? 'var(--aquamarine)' : 'rgba(255, 255, 255, 0.6)'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 202, 0.1);
    border-color: rgba(0, 255, 202, 0.3);
    color: var(--aquamarine);
  }
`;

const TokenModal = ({ token, onClose, isOpen }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Simulated price history data - replace with actual API call
      const generatePriceHistory = () => {
        const basePrice = token.pools[0]?.price?.usd || 100;
        const points = 24;
        const data = [];
        const labels = [];
        
        for (let i = 0; i < points; i++) {
          const time = new Date();
          time.setHours(time.getHours() - (points - i));
          labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          
          const randomChange = (Math.random() - 0.5) * 0.02; // ±1% change
          const price = basePrice * (1 + randomChange);
          data.push(price);
        }

        return { labels, data };
      };

      const { labels, data } = generatePriceHistory();

      setChartData({
        labels,
        datasets: [
          {
            label: 'Price',
            data: data,
            fill: true,
            borderColor: 'rgba(0, 255, 202, 1)',
            backgroundColor: 'rgba(0, 255, 202, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: 'rgba(0, 255, 202, 1)',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
        ],
      });
    }
  }, [isOpen, selectedTimeframe, token]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 27, 61, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 255, 202, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `$${context.raw.toFixed(6)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10,
          },
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10,
          },
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

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

  const stats = [
    {
      label: 'Current Price',
      value: formatNumber(token.pools[0]?.price?.usd || 0)
    },
    {
      label: 'Market Cap',
      value: formatNumber(token.pools[0]?.marketCap?.usd || 0)
    },
    {
      label: '24h Change',
      value: `${(token.events['24h']?.priceChangePercentage || 0).toFixed(2)}%`,
      isChange: true,
      positive: token.events['24h']?.priceChangePercentage >= 0
    },
    {
      label: 'Total Liquidity',
      value: formatNumber(token.pools[0]?.liquidity?.usd || 0)
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton
              onClick={onClose}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              ×
            </CloseButton>

            <TokenHeader>
              <TokenIcon src={token.token.image} alt={token.token.name} />
              <TokenInfo>
                <TokenName>{token.token.name}</TokenName>
                <TokenSymbol>{token.token.symbol}</TokenSymbol>
              </TokenInfo>
            </TokenHeader>

            <StatsGrid>
              {stats.map((stat, index) => (
                <StatCard key={index}>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatValue style={{
                    color: stat.isChange
                      ? stat.positive
                        ? '#00ff9d'
                        : '#ff4d4d'
                      : '#fff'
                  }}>
                    {stat.value}
                    {stat.isChange && (
                      <span>{stat.positive ? '↑' : '↓'}</span>
                    )}
                  </StatValue>
                </StatCard>
              ))}
            </StatsGrid>

            <ChartContainer>
              <ChartHeader>
                <h3>Price History</h3>
                <TimeframeButtons>
                  {['24H', '7D', '30D'].map((tf) => (
                    <TimeframeButton
                      key={tf}
                      active={selectedTimeframe === tf}
                      onClick={() => setSelectedTimeframe(tf)}
                    >
                      {tf}
                    </TimeframeButton>
                  ))}
                </TimeframeButtons>
              </ChartHeader>
              {chartData && (
                <Line data={chartData} options={chartOptions} />
              )}
            </ChartContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default TokenModal; 