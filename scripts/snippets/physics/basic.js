/**
 * 基础物理模拟
 *
 * 提供简单的重力、碰撞检测
 */

module.exports = `
// === 基础物理模拟 ===

const physics = {
    gravity: -9.8,
    friction: 0.98,
    restitution: 0.8,

    // 应用重力
    applyGravity: function(object, deltaTime) {
        if (object.velocity) {
            object.velocity.y += this.gravity * deltaTime;
        }
    },

    // 应用摩擦力
    applyFriction: function(object) {
        if (object.velocity) {
            object.velocity.x *= this.friction;
            object.velocity.z *= this.friction;
        }
    },

    // 地面碰撞检测
    checkGroundCollision: function(object, groundY = 0) {
        if (object.position.y <= groundY) {
            object.position.y = groundY;
            if (object.velocity) {
                object.velocity.y *= -this.restitution;
                if (Math.abs(object.velocity.y) < 0.1) {
                    object.velocity.y = 0;
                }
            }
            return true;
        }
        return false;
    },

    // 球体碰撞检测
    checkSphereCollision: function(obj1, obj2, radius1, radius2) {
        const dx = obj1.position.x - obj2.position.x;
        const dy = obj1.position.y - obj2.position.y;
        const dz = obj1.position.z - obj2.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance < (radius1 + radius2);
    },

    // 更新物理状态
    update: function(object, deltaTime) {
        if (!object.velocity) return;

        // 应用重力
        this.applyGravity(object, deltaTime);

        // 更新位置
        object.position.x += object.velocity.x * deltaTime;
        object.position.y += object.velocity.y * deltaTime;
        object.position.z += object.velocity.z * deltaTime;

        // 应用摩擦
        this.applyFriction(object);

        // 地面碰撞
        this.checkGroundCollision(object);
    }
};
`;
