/**
 * 基础粒子系统
 *
 * 提供简单但高效的粒子系统
 */

module.exports = `
// === 基础粒子系统 ===

function createParticleSystem(config) {
    const {
        count = 1000,
        size = 0.1,
        color = 0x00c6ff,
        spread = 10
    } = config;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = (Math.random() - 0.5) * spread;

        velocities[i] = (Math.random() - 0.5) * 0.1;
        velocities[i + 1] = (Math.random() - 0.5) * 0.1;
        velocities[i + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        size: size,
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return {
        mesh: particles,
        update: function() {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // 边界检查
                if (Math.abs(positions[i]) > spread / 2) velocities[i] *= -1;
                if (Math.abs(positions[i + 1]) > spread / 2) velocities[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > spread / 2) velocities[i + 2] *= -1;
            }

            particles.geometry.attributes.position.needsUpdate = true;
        }
    };
}
`;
