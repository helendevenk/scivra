/**
 * GSAP 动画系统
 *
 * 依赖:
 * - GSAP 3.12.2
 *
 * CDN:
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
 */

module.exports = `
// === GSAP 动画系统 ===

// 动画预设
const animations = {
    fadeIn: (object, duration = 0.5) => {
        object.material.transparent = true;
        object.material.opacity = 0;
        gsap.to(object.material, {
            opacity: 1,
            duration: duration,
            ease: 'power2.out'
        });
    },

    bounce: (object, height = 2, duration = 1) => {
        gsap.to(object.position, {
            y: object.position.y + height,
            duration: duration,
            ease: 'elastic.out(1, 0.3)',
            repeat: -1,
            yoyo: true
        });
    },

    rotate: (object, duration = 4) => {
        gsap.to(object.rotation, {
            y: Math.PI * 2,
            duration: duration,
            ease: 'linear',
            repeat: -1
        });
    },

    pulse: (object, scale = 1.2, duration = 0.8) => {
        gsap.to(object.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: duration,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
        });
    },

    float: (object, amplitude = 0.5, duration = 2) => {
        gsap.to(object.position, {
            y: object.position.y + amplitude,
            duration: duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }
};
`;
