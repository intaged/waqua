import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(138, 180, 255, 0.1);
  border-top: 3px solid rgba(138, 180, 255, 0.8);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = () => {
  return <SpinnerContainer />;
};

export default LoadingSpinner; 