import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TokenPulse from './components/TokenPulse';
import CryptoDashboard from './components/CryptoDashboard';
import LoadingScreen from './components/LoadingScreen';
import { fetchGraduatedTokens, fetchTrendingTokens } from './services/api';
import './styles/App.css';

const DashboardSection = styled.section`
  padding: 4rem 0;
  position: relative;
`;

const MainContent = styled(motion.div)`
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 1s ease;
`;

function App() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [graduated, trending] = await Promise.all([
          fetchGraduatedTokens(),
          fetchTrendingTokens()
        ]);
        setTokens([...graduated, ...trending]);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    window.scrollTo(0, 0);
  };

  if (loading) return null;

  return (
    <>
      {showLoadingScreen ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <MainContent show={!showLoadingScreen}>
          <Layout>
            <HeroSection />
            <AboutSection />
            <DashboardSection>
              <CryptoDashboard />
            </DashboardSection>
            <TokenPulse tokens={tokens} />
          </Layout>
        </MainContent>
      )}
    </>
  );
}

export default App; 