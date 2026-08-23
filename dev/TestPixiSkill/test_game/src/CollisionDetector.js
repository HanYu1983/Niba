// 碰撞檢測系統
export function createCollisionDetector() {
  return {
    // 碰撞群組
    playerBullets: [],
    enemyBullets: [],
    enemies: [],
    player: null,

    // 碰撞檢測方法
    checkCollision(obj1, obj2, radius1 = 15, radius2 = 15) {
      const dx = obj1.x - obj2.x;
      const dy = obj1.y - obj2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < radius1 + radius2;
    },

    // 清空所有群組
    clear() {
      this.playerBullets = [];
      this.enemyBullets = [];
      this.enemies = [];
      this.player = null;
    }
  };
}
