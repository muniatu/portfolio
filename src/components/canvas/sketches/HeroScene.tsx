"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, Vector2, Mesh } from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
precision highp int;
varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uRadius;

// Baked parameters
const float RING_INTENSITY = 0.015;
const float RING_THICKNESS = 0.05;
const float RING_SKEW_X = 0.77;
const float RING_SKEW_Y = 0.81;
const float RING_ROTATION = 0.243;
const float NOISE_STRENGTH = 0.88;
const float NOISE_SCALE = 1.4;
const float NOISE_SPEED = 0.175;
const float CHROMA_AMOUNT = 0.02;
const float CHROMA_DIVISIONS = 2.0;
const float CHROMA_ROT_SPEED = 0.042;
const float GRAIN_AMOUNT = 0.15;
const float RIPPLE_INTENSITY = 0.1;
const float SPEED = 1.55;
const float MOUSE_INFLUENCE = 0.34;
const float CONTRAST = 1.15;
const float BRIGHTNESS = 0.02;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.y * 1664525u + 1013904223u;
  v.y += v.x * v.x * 1664525u + 1013904223u;
  v ^= v >> 16u;
  return v;
}
float rand(vec2 p) {
  uvec2 v = floatBitsToUint(p);
  v = pcg2d(v);
  return float(v.x ^ v.y) / float(0xffffffffu);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(
    (p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}
float perlin(vec3 p) {
  vec3 pi = floor(p); vec3 pf = p - pi;
  vec3 w = pf * pf * (3.0 - 2.0 * pf);
  return mix(
    mix(mix(dot(pf-vec3(0,0,0),hash33(pi+vec3(0,0,0))),dot(pf-vec3(1,0,0),hash33(pi+vec3(1,0,0))),w.x),
        mix(dot(pf-vec3(0,1,0),hash33(pi+vec3(0,1,0))),dot(pf-vec3(1,1,0),hash33(pi+vec3(1,1,0))),w.x),w.y),
    mix(mix(dot(pf-vec3(0,0,1),hash33(pi+vec3(0,0,1))),dot(pf-vec3(1,0,1),hash33(pi+vec3(1,0,1))),w.x),
        mix(dot(pf-vec3(0,1,1),hash33(pi+vec3(0,1,1))),dot(pf-vec3(1,1,1),hash33(pi+vec3(1,1,1))),w.x),w.y),
    w.z);
}

mat2 rot(float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

float scene(vec2 uv) {
  float aspect = uResolution.x / uResolution.y;
  vec2 ringCenter = vec2(0.5) + (uMouse - 0.5) * MOUSE_INFLUENCE;

  vec2 ruv = uv * vec2(aspect, 1.0);
  vec2 rc = ringCenter * vec2(aspect, 1.0);
  vec2 skew = vec2(RING_SKEW_X, RING_SKEW_Y) * 2.0;
  ruv = rot(RING_ROTATION * TWO_PI) * ruv * skew;
  rc = rot(RING_ROTATION * TWO_PI) * rc * skew;
  vec2 p = ruv - rc;
  float r = uRadius * 0.4;
  float sdf = abs(length(p) - r) - r * RING_THICKNESS;
  float glow = 0.5 / (1.0 - smoothstep(0.12, 0.01, abs(sdf) + 0.02));
  float ring = glow * pow(max(0.0, 1.0 - abs(sdf)), 3.0) * RING_INTENSITY;

  float v = CONTRAST * (ring - 0.5) + 0.5 + BRIGHTNESS;

  vec2 ripUv = uv * vec2(aspect, 1.0);
  vec2 ripC = vec2(0.5 * aspect, 0.5);
  ripUv = rot(0.2511 * TWO_PI) * ripUv;
  ripC = rot(0.2511 * TWO_PI) * ripC;
  float modulo = fract(uTime * SPEED * 0.04 + 1.0);
  float ripDist = abs(length(ripUv - ripC) - uRadius * 0.5 * modulo);
  float ripBright = 0.83 * modulo / (1.0 - smoothstep(0.2, 0.002, ripDist + 0.02));
  ripBright *= max(0.0, 1.0 - modulo);
  float ripple = ripBright * pow(max(0.0, 1.0 - ripDist), 3.0) * 0.05;

  return clamp(v + ripple * RIPPLE_INTENSITY, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;

  vec2 st = (uv - 0.5) * vec2(aspect, 1.0) * NOISE_SCALE;
  st = rot(0.0054 * -TWO_PI) * st;
  float nX = perlin(vec3(st * 0.5, uTime * NOISE_SPEED));
  float nY = perlin(vec3((st + 4.37) * 0.5, uTime * NOISE_SPEED));
  vec2 noiseOff = vec2(nX, nY) * 0.75 + 0.5;
  vec2 distUv = mix(uv, noiseOff, NOISE_STRENGTH);

  vec2 blindsC = vec2(0.5, 0.5);
  vec2 uvA = distUv * vec2(aspect, 1.0);
  vec2 posA = blindsC * vec2(aspect, 1.0);
  vec2 stRot = rot(0.125 * -TWO_PI) * (uvA - posA) + posA;
  vec2 diff = stRot - posA;
  float angle = atan(diff.y, diff.x);
  float segment = fract((angle + uTime * CHROMA_ROT_SPEED + PI) / TWO_PI * CHROMA_DIVISIONS);
  segment = smoothstep(0.0, 0.5, segment) - smoothstep(0.5, 1.0, segment);

  vec3 distortVec = mix(
    mix(vec3(1,0,0), vec3(0,1,0), clamp(segment * 2.0, 0.0, 1.0)),
    mix(vec3(0,1,0), vec3(0,0,1), clamp((segment - 0.5) * 2.0, 0.0, 1.0)),
    step(0.5, segment)
  );

  float distPow = 2.76;
  vec2 dir = normalize(diff + 0.0001) / vec2(aspect, 1.0);
  float dispR = pow(distortVec.r, distPow) * CHROMA_AMOUNT;
  float dispB = pow(distortVec.b, distPow) * CHROMA_AMOUNT;

  vec3 color = vec3(0.0);
  const int STEPS = 10;
  float inv = 1.0 / float(STEPS);
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) * inv;
    color.r += scene(distUv - dir * dispR * t);
    color.g += scene(distUv - dir * dispR * t * 0.5 + dir * dispB * t * 0.5);
    color.b += scene(distUv + dir * dispB * t);
  }
  color *= inv;

  float delta = floor(uTime);
  vec2 gOff = vec2(rand(vec2(123.0, 16.0) + delta), rand(vec2(56.0, 96.0) + delta));
  float noise = rand(vUv + gOff) - 0.005;
  color = mix(color, floor(color * 2.0 + noise) / 2.0, GRAIN_AMOUNT);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export default function HeroScene() {
  const meshRef = useRef<Mesh>(null);
  const { size } = useThree();
  const mouseSmooth = useRef(new Vector2(0.5, 0.5));

  const material = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uResolution: { value: new Vector2(size.width, size.height) },
        uRadius: { value: 0 },
      },
      depthWrite: false,
      depthTest: false,
    });
  }, []);

  useFrame(({ pointer, clock }) => {
    if (!material) return;
    material.uniforms.uTime.value = clock.elapsedTime;
    mouseSmooth.current.lerp(
      new Vector2((pointer.x + 1) * 0.5, (pointer.y + 1) * 0.5),
      0.03
    );
    material.uniforms.uMouse.value.copy(mouseSmooth.current);
    material.uniforms.uResolution.value.set(size.width * 2, size.height * 2);

    const t = Math.min(1, clock.elapsedTime / 4);
    material.uniforms.uRadius.value = (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)) * 0.85;
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
