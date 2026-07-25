import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 3D Particle Swarm Accretion Disk Simulation Component
export const ParticleSwarm = ({ isMobile }) => {
  const meshRef = useRef();
  
  // Adjust particle count for performance: 100,000 on desktop, 25,000 on mobile
  const count = isMobile ? 25000 : 100000;
  const speedMult = 0.3;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility

  const geometry = useMemo(
    () => new THREE.SphereGeometry(isMobile ? 0.12 : 0.08, 6, 6),
    [isMobile]
  );

  const material = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }),
    []
  );

  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 180;
      arr.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          (Math.random() - 0.5) * 2,
          radius * Math.sin(angle)
        )
      );
    }
    return arr;
  }, [count]);

  const PARAMS = useMemo(() => ({ "scale": 90, "spin": 3, "accretion": 1, "warp": 1.2 }), []);
  const addControl = (id, l, min, max, val) => {
    return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => { };
  const annotate = () => { };

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;

    if (material.uniforms && material.uniforms.uTime) {
      material.uniforms.uTime.value = time;
    }

    for (let i = 0; i < count; i++) {
      // Accretion disk math formulas
      const scale = addControl("scale", "Event Horizon", 20, 200, 90);
      const spin = addControl("spin", "Spin", 0.2, 8.0, 3.0);
      const accretion = addControl("accretion", "Accretion Disk", 0.0, 2.0, 1.0);
      const warp = addControl("warp", "Space Warp", 0.0, 3.0, 1.2);

      if (i === 0) {
        setInfo("Black Hole Singularity", "A relativistic accretion disk spiraling into a warped gravitational well.");
        annotate("bh", new THREE.Vector3(0, 0, 0), "Singularity");
      }

      const u = (i + 0.5) / count;
      const ga = 2.399963229728653;
      const a = i * ga;

      const t = time * 0.35;
      const band = u * 24.0 - 12.0;

      const disk = 1.0 - Math.abs(Math.sin(band * 0.5));
      const radius = scale * (0.08 + 1.9 * u * u);

      const swirl = a + spin * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u));

      const grav = 1.0 / (1.0 + radius * 0.015);
      const bend = warp * grav * grav;

      const x0 = radius * Math.cos(swirl);
      const z0 = radius * Math.sin(swirl);

      const x = x0 + bend * z0;
      const z = z0 - bend * x0;

      const y = scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * accretion;

      target.set(x, y, z);

      // Relativistic accretion disk coloring (heats up as it gets closer to event horizon)
      const heat = 1.0 - Math.min(1.0, radius / (scale * 2.0));
      const hue = 0.08 + 0.58 * (1.0 - heat);
      const sat = 0.8 + 0.2 * heat;
      const light = 0.15 + 0.55 * Math.pow(heat, 1.5);

      color.setHSL(hue, sat, light);

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
      {/* Black Hole Event Horizon (Opaque Singularity Sphere) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[10.0, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

export default ParticleSwarm;
