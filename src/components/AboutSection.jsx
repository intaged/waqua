import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #050714 0%, #0A0B1E 100%);
  position: relative;
`;

const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const TextContent = styled(motion.div)`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(45deg, #fff, #8ab4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(138, 180, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;

  h3 {
    font-size: 2.5rem;
    color: #8ab4ff;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
    margin: 0;
  }
`;

const AboutSection = () => {
  return (
    <AboutContainer>
      <ContentGrid>
        <TextContent
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Empowering Your Digital Asset Journey</h2>
          <p>
            We provide real-time analytics and insights for the most promising tokens
            in the digital economy. Our platform combines advanced technology with
            intuitive design to help you make informed decisions.
          </p>
        </TextContent>
        <StatsGrid>
          {[
            { value: '1M+', label: 'Active Users' },
            { value: '$50B+', label: 'Trading Volume' },
            { value: '1000+', label: 'Tokens Tracked' },
            { value: '24/7', label: 'Real-time Updates' }
          ].map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </StatCard>
          ))}
        </StatsGrid>
      </ContentGrid>
    </AboutContainer>
  );
};

export default AboutSection; 