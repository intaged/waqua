import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  min-height: 100vh;
  background: linear-gradient(135deg, var(--deep-ocean) 0%, var(--ocean-surface) 100%);
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
    if (!loading) {
      setShowLoadingScreen(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showLoadingScreen ? (
        <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
      ) : (
        <MainContent
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
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
    </AnimatePresence>
  );
}

export default App; 