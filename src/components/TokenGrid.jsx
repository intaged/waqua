import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const TokenGrid = ({ children, loading }) => {
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return <Grid>{children}</Grid>;
};

export default TokenGrid; 