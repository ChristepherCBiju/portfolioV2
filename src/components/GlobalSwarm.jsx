import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { UnrealBloomPass } from 'three-stdlib'
import * as THREE from 'three'

extend({ UnrealBloomPass })

const UnifiedSwarm = ({ scrollProgress, isMobile }) => {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const pColor = useMemo(() => new THREE.Color(), [])
  const color = pColor

  // Track global normalized mouse coordinates for repulsion/vortex interactions
  const mouse = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Parameters
  const count = isMobile ? 12000 : 25000
  const maxActiveStardust = isMobile ? 4000 : 7500
  const speedMult = 0.35

  // Initial stardust positions base array
  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.sqrt(Math.random()) * 160
      pos.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          (Math.random() - 0.5) * 150,
          radius * Math.sin(angle)
        )
      )
    }
    return pos
  }, [count])

  const material = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }),
    []
  )

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.22), [])

  // ACCRETION DISK ARGS
  const scaleBH = 90
  const spinBH = 3.0
  const accretionBH = 1.0
  const warpBH = 1.2

  // GALAXY BACKGROUND ARGS
  const scaleG = 110
  const gravityG = 1.2
  const rotationG = 0.8
  const pulseG = 1.0
  const distortionG = 0.4
  const galaxiesG = 4

  const mouse3D = new THREE.Vector3()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime() * speedMult

    // Calculate transition factor (t) from Black Hole (0.0) to Galaxy (1.0)
    let t = 0
    if (scrollProgress > 0.8) {
      t = (scrollProgress - 0.8) / 0.2
    }

    // --- Dynamic Camera Animation Track ---
    const animTime = state.clock.getElapsedTime() * 0.12
    // Slow down rotation as the user enters the static background galaxy phase
    const rotationAngle = animTime * (1.0 - t * 0.7)
    
    const height = THREE.MathUtils.lerp(80, 0, t)
    const radius = THREE.MathUtils.lerp(136, 100, t)
    const fov = THREE.MathUtils.lerp(45, 60, t)

    state.camera.position.x = Math.sin(rotationAngle) * radius
    state.camera.position.z = Math.cos(rotationAngle) * radius
    state.camera.position.y = height
    state.camera.fov = fov
    state.camera.updateProjectionMatrix()
    state.camera.lookAt(0, 0, 0)

    // Project cursor coordinate onto 3D z=0 plane
    const tempV = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5)
    tempV.unproject(state.camera)
    const dir = tempV.sub(state.camera.position).normalize()
    const distance = -state.camera.position.z / dir.z
    mouse3D.copy(state.camera.position).add(dir.multiplyScalar(distance))

    // Morph stardust positions and colors
    for (let i = 0; i < count; i++) {
      // 1. Accretion Disk Coordinates (Black Hole)
      const uBH = (i + 0.5) / count
      const ga = 2.399963229728653
      const a = i * ga
      const tBH = time * 0.35
      const band = uBH * 24.0 - 12.0
      const disk = 1.0 - Math.abs(Math.sin(band * 0.5))
      const radiusBH = scaleBH * (0.08 + 1.9 * uBH * uBH)
      const swirlBH = a + spinBH * Math.log(radiusBH + 1.0) - tBH * (2.0 + 3.0 * (1.0 - uBH))
      const grav = 1.0 / (1.0 + radiusBH * 0.015)
      const bend = warpBH * grav * grav
      const x0 = radiusBH * Math.cos(swirlBH)
      const z0 = radiusBH * Math.sin(swirlBH)

      const xBH = x0 + bend * z0
      const zBH = z0 - bend * x0
      const yBH = scaleBH * 0.22 * disk * Math.sin(a * 0.17 + tBH * 4.0) * accretionBH

      // 2. Galaxy Spiral Coordinates (Background)
      const tG = time * rotationG
      const pG = i / Math.max(count, 1)
      const armG = pG * galaxiesG * 6.28318530718
      const thetaG = i * ga + tG * 0.25
      const radiusBaseG = Math.sqrt(pG) * scaleG
      const waveA = Math.sin(thetaG * 2.0 + tG * 0.8)
      const waveB = Math.cos(thetaG * 3.0 - tG * 0.6)
      const waveC = Math.sin(armG * 2.0 + tG)
      const radiusG = radiusBaseG * (1.0 + 0.25 * waveA + 0.15 * distortionG * waveB)
      const swirlG = thetaG + gravityG * radiusG * 0.015 + 0.5 * waveC

      const xG = Math.cos(swirlG) * radiusG + Math.sin(thetaG * 4.0 + tG) * distortionG * radiusG * 0.15
      const yG = (radiusBaseG - scaleG * 0.5) * 0.8 + Math.sin(thetaG * 1.5 + tG * 0.7) * scaleG * 0.18 + waveA * distortionG * scaleG * 0.08
      const zG = Math.sin(swirlG) * radiusG + Math.cos(thetaG * 5.0 - tG) * distortionG * radiusG * 0.15

      // 3. Linearly Interpolate Target Shape Coordinates
      const finalX = THREE.MathUtils.lerp(xBH, xG, t)
      const finalY = THREE.MathUtils.lerp(yBH, yG, t)
      const finalZ = THREE.MathUtils.lerp(zBH, zG, t)
      target.set(finalX, finalY, finalZ)

      // 4. Linearly Interpolate HSL Colors
      // BH Warm accretion colors (heats up as it spirals closer to Event Horizon)
      const heat = 1.0 - Math.min(1.0, radiusBH / (scaleBH * 2.0))
      const hueBH = 0.08 + 0.58 * (1.0 - heat)
      const satBH = 0.8 + 0.2 * heat
      const lightBH = 0.15 + 0.55 * Math.pow(heat, 1.5)
      const cBH = new THREE.Color().setHSL(hueBH, satBH, lightBH)

      // Galaxy cyber-neon colors (yellow/limes)
      const energy = 0.5 + 0.5 * Math.sin(radiusG * 0.05 - tG * pulseG + waveB)
      const hueG = 0.08 + 0.12 * Math.sin(thetaG * 0.2 + tG * 0.15) + 0.03 * energy
      const satG = 0.85 + 0.15 * Math.abs(Math.sin(thetaG * 0.5))
      const lightG = 0.22 + 0.38 * energy + 0.15 * Math.abs(waveA)
      const cGalaxy = new THREE.Color().setHSL(((hueG % 1) + 1) % 1, satG, lightG)

      pColor.lerpColors(cBH, cGalaxy, t)

      // --- Cursor Interaction (Only active/strength-scaled during background phase) ---
      if (t > 0.15) {
        const cursorStrength = (t - 0.15) / 0.85
        const dx = target.x - mouse3D.x
        const dy = target.y - mouse3D.y
        const dz = target.z - mouse3D.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        const interactRadius = 45
        if (dist < interactRadius) {
          const pct = (1.0 - dist / interactRadius)
          
          // Enhanced Repulsion Force (Multiplier 25)
          const repulsionForce = pct * 25 * cursorStrength
          target.x += (dx / (dist || 1)) * repulsionForce
          target.y += (dy / (dist || 1)) * repulsionForce
          target.z += (dz / (dist || 1)) * repulsionForce

          // Added Swirl Vortex Force
          const swirlForce = pct * 18 * cursorStrength
          const tx = -dy
          const ty = dx
          target.x += (tx / (dist || 1)) * swirlForce
          target.y += (ty / (dist || 1)) * swirlForce

          // Glow Spark effect under hover (offset lightness)
          pColor.offsetHSL(0, 0, 0.22 * pct * cursorStrength)
        }
      }

      // --- Particle Density Reduction (Fade-out excess particles) ---
      let pScale = 1.0
      if (i > maxActiveStardust) {
        pScale = 1.0 - t
      }

      positions[i].lerp(target, 0.08)
      dummy.position.copy(positions[i])
      dummy.scale.set(pScale, pScale, pScale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, pColor)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  // Render the instanced mesh and the Event Horizon (opaque black center)
  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
      {scrollProgress < 0.98 && (
        <mesh position={[0, 0, 0]} scale={1.0 - (scrollProgress < 0.8 ? 0 : (scrollProgress - 0.8) / 0.2) * 0.95}>
          <sphereGeometry args={[10.0, 32, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={1.0 - (scrollProgress < 0.8 ? 0 : (scrollProgress - 0.8) / 0.2)} />
        </mesh>
      )}
    </group>
  )
}

export const GlobalSwarm = ({ scrollProgress, isMobile }) => {
  return (
    <div className="global-canvas-container">
      <Canvas camera={{ position: [0, 80, 110], fov: 45 }}>
        <fog attach="fog" args={['#000000', 0.015]} />
        <UnifiedSwarm scrollProgress={scrollProgress} isMobile={isMobile} />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.6} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  )
}

export default GlobalSwarm
