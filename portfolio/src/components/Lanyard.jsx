/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import cardGLB from './card.glb';
import lanyard from './lanyard.png';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

/**
 * Dynamically generates a high-resolution canvas texture for the front or back
 * of the identity card, matching the website's dark cybernetic theme.
 */
const generateCardFace = (side, profileImg) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  
  // Fill background - deep cyber dark
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, 512, 720);
  
  // Draw subtle digital tech grid
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 720);
    ctx.stroke();
  }
  for (let j = 0; j < 720; j += 32) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(512, j);
    ctx.stroke();
  }

  // Draw cyber border in website accent colors
  ctx.strokeStyle = side === 'front' ? '#CEF549' : '#FDE04C'; // Lime on front, Yellow on back
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 708);
  
  // Draw inner framing lines
  ctx.strokeStyle = '#1e1e1e';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 464, 672);

  if (side === 'front') {
    // Header Label
    ctx.fillStyle = '#CEF549';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CORE ACCESS BADGE', 256, 64);

    // NFC Gold Smart Chip Graphic
    ctx.fillStyle = '#FDE04C';
    ctx.fillRect(72, 110, 54, 42);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(72, 110, 54, 42);
    ctx.beginPath();
    ctx.moveTo(90, 110); ctx.lineTo(90, 152);
    ctx.moveTo(108, 110); ctx.lineTo(108, 152);
    ctx.moveTo(72, 124); ctx.lineTo(126, 124);
    ctx.moveTo(72, 138); ctx.lineTo(126, 138);
    ctx.stroke();

    // Photo/Logo Frame
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2;
    ctx.strokeRect(176, 116, 160, 160);
    
    if (profileImg) {
      // Draw profile image cropped and centered inside the 160x160 photo frame
      ctx.save();
      ctx.beginPath();
      ctx.rect(176, 116, 160, 160);
      ctx.clip();
      const iw = profileImg.width;
      const ih = profileImg.height;
      const scale = Math.max(160 / iw, 160 / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = 176 + (160 - dw) / 2;
      const dy = 116 + (160 - dh) / 2;
      ctx.drawImage(profileImg, dx, dy, dw, dh);
      ctx.restore();
    } else {
      ctx.fillStyle = '#111111';
      ctx.fillRect(176, 116, 160, 160);
      ctx.fillStyle = '#CEF549';
      ctx.font = 'bold 44px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('</>', 256, 210);
    }

    // Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "DIN Condensed", "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('C. C. BIJU', 256, 335);

    // Role
    ctx.fillStyle = '#CEF549';
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.fillText('FULL-STACK & ML', 256, 375);

    // Technical Details Divider Line
    ctx.strokeStyle = '#202020';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 410);
    ctx.lineTo(464, 410);
    ctx.stroke();

    // Metadata lines
    ctx.textAlign = 'left';
    ctx.fillStyle = '#B3B3B3';
    ctx.font = '14px monospace';
    
    const metaInfo = [
      'LOC: Thrissur, Kerala',
      'EDU: BTech CSE (8.77 CGPA)',
      'SYS: React / Next / FastAPIs / YOLO',
      'EXP: Full-Stack / ML / UI/UX Design'
    ];
    
    metaInfo.forEach((line, idx) => {
      ctx.fillText(line, 52, 455 + idx * 34);
    });

  } else {
    // BACK SIDE
    // Big central emblem / initials logo
    ctx.fillStyle = '#FDE04C';
    ctx.font = 'bold 76px "DIN Condensed", "Barlow Condensed", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('C.C.B.', 256, 260);

    ctx.fillStyle = '#B3B3B3';
    ctx.font = '15px monospace';
    ctx.fillText('PORTFOLIO INTERACTIVE ID', 256, 310);

    // Cyber security geometric design
    ctx.strokeStyle = '#CEF549';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 440, 52, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#CEF549';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('CCB', 256, 448);

    // Barcode representation at the bottom
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(80, 560, 352, 60);
    
    ctx.fillStyle = '#000000';
    let currentX = 90;
    while (currentX < 420) {
      const barWidth = Math.floor(Math.random() * 4) + 1.5;
      ctx.fillRect(currentX, 565, barWidth, 50);
      currentX += barWidth + Math.floor(Math.random() * 5) + 1.5;
    }
  }

  return canvas.toDataURL();
};

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.2
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Log computed sizes of the container and canvas
  useEffect(() => {
    const timer = setTimeout(() => {
      const wrapper = document.querySelector('.lanyard-wrapper');
      const canvas = wrapper?.querySelector('canvas');
      if (wrapper && canvas) {
        console.log("DIAG_SIZE: wrapper=", wrapper.clientWidth, "x", wrapper.clientHeight, "canvas=", canvas.clientWidth, "x", canvas.clientHeight);
      } else {
        console.log("DIAG_SIZE: wrapper or canvas NOT found");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load the profile image asynchronously
  useEffect(() => {
    const img = new Image();
    img.src = '/profile.jpg';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setProfileImg(img);
    };
  }, []);

  // Compute final base64 textured cards dynamically
  const finalFront = useMemo(() => frontImage || generateCardFace('front', profileImg), [frontImage, profileImg]);
  const finalBack = useMemo(() => backImage || generateCardFace('back', profileImg), [backImage, profileImg]);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={Math.PI} />
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={finalFront}
              backImage={finalBack}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1.2
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  console.log("GLTF NODES:", Object.keys(nodes), "MATERIALS:", Object.keys(materials));
  const texture = useTexture(lanyardImage || lanyard);
  
  // Unconditional texture loads
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img, rect) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 2.16, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (card.current) {
      const trans = card.current.translation();
      console.log("CARD_POSITION_VAL:", trans.x.toFixed(2), trans.y.toFixed(2), trans.z.toFixed(2));
    }
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1.15, 1.625, 0.01]} />
          <group
            scale={3.25}
            position={[0, -1.73, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#CEF549" /* Cyber Lime */
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
