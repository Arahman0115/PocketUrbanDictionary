import * as THREE from 'three';

export function createParticleBackground(scene) {
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 10000; // Number of stars

// Create arrays to hold the particle positions and colors
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Populate the arrays with random positions and colors
for (let i = 0; i < particleCount; i++) {
    // Random position within a cube
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Random color (white or slightly yellowish)
    colors[i * 3] = Math.random() * 0.5 + 0.5; // R
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G
    colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
}

// Set the particle positions and colors
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Create a particle material
const particleMaterial = new THREE.PointsMaterial({
    size: 5, // Size of the stars
    vertexColors: THREE.VertexColors // Enable per-vertex coloring
});

// Create the particle system
const particles = new THREE.Points(particleGeometry, particleMaterial);

}