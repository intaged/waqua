import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import styled from 'styled-components';
import * as THREE from 'three';

const TokenLabel = styled.div`
  background: rgba(13, 14, 45, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  white-space: nowrap;
  pointer-events: none;
  transform: scale(${props => props.scale});
  transition: transform 0.3s ease;
`;

const TokenOrb = ({ position, token, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const priceChange = token.events['24h']?.priceChangePercentage || 0;
  const color = priceChange >= 0 ? '#00ff9d' : '#ff4d4d';

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
      <Html distanceFactor={15}>
        <TokenLabel scale={hovered ? 1.2 : 1}>
          {token.token.symbol}
        </TokenLabel>
      </Html>
    </mesh>
  );
};

export default TokenOrb; 