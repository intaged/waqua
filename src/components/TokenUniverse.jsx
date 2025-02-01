import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import styled from 'styled-components';
import TokenOrb from './TokenOrb';
import TokenDetails from './TokenDetails';

const UniverseContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #000510;
  position: relative;
`;

const TokenInfo = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(13, 14, 45, 0.95);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(138, 180, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 400px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(100px)'};
  transition: all 0.5s ease;
  z-index: 100;

  @media (max-width: 768px) {
    right: 50%;
    top: auto;
    bottom: 2rem;
    transform: translateX(50%);
    width: 90%;
  }
`;

const TokenUniverse = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState(null);

  return (
    <UniverseContainer>
      <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
        />
        <TokenGalaxy tokens={tokens} onSelect={setSelectedToken} />
      </Canvas>
      <TokenInfo visible={selectedToken !== null}>
        {selectedToken && (
          <TokenDetails token={selectedToken} />
        )}
      </TokenInfo>
    </UniverseContainer>
  );
};

const TokenGalaxy = ({ tokens, onSelect }) => {
  const groupRef = useRef();

  useFrame((state) => {
    groupRef.current.rotation.y += 0.001;
  });

  return (
    <group ref={groupRef}>
      {tokens.map((token, i) => {
        const angle = (i / tokens.length) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 5;

        return (
          <TokenOrb
            key={token.token.mint}
            position={[x, y, z]}
            token={token}
            onClick={() => onSelect(token)}
          />
        );
      })}
    </group>
  );
};

export default TokenUniverse; 