const dataJson = 
{
  "weaponType": {
    "single": {
      "title": "單一"
    },
    "line": {
      "title": "線形"
    }
  },
  "weaponAbility": {
    "moveAttack": {
      "title": "移動可"
    }
  },
  "weaponEnergyType": {
    "energy": {
      "title": "能量"
    },
    "bullet": {
      "title": "彈數"
    }
  },
  "weapon": {
    "bean_gun": {
      "range": [
        2,
        6
      ],
      "energyCost": 15,
      "maxBulletCount": 0,
      "suitability": [
        1,
        0.5,
        1,
        1
      ],
      "ablitity": [],
      "energyType": "energy",
      "title": "光束鎗",
      "type": "single",
      "accuracy": 0.7,
      "damage": 3000
    },
    "bean_bigGun": {
      "range": [
        3,
        7
      ],
      "energyCost": 40,
      "maxBulletCount": 0,
      "suitability": [
        1,
        0.5,
        1,
        1
      ],
      "ablitity": [],
      "energyType": "energy",
      "title": "巨型光束鎗",
      "type": "single",
      "accuracy": 0.6,
      "damage": 4500
    },
    "bean_gatling": {
      "range": [
        2,
        4
      ],
      "energyCost": 10,
      "maxBulletCount": 0,
      "suitability": [
        1,
        0.5,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "光束加特林",
      "type": "single",
      "accuracy": 0.8,
      "damage": 2000
    },
    "bean_sword": {
      "range": [
        1,
        1
      ],
      "energyCost": 5,
      "maxBulletCount": 0,
      "suitability": [
        1,
        0.5,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "光束劍",
      "type": "single",
      "accuracy": 0.9,
      "damage": 2500
    },
    "bean_bigSword": {
      "range": [
        1,
        2
      ],
      "energyCost": 30,
      "maxBulletCount": 0,
      "suitability": [
        1,
        0.5,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "巨型光束劍",
      "type": "line",
      "accuracy": 0.7,
      "damage": 3000
    },
    "gaite_handSword": {
      "range": [
        1,
        1
      ],
      "energyCost": 5,
      "maxBulletCount": 0,
      "suitability": [
        1,
        1,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "蓋特手刀",
      "type": "single",
      "accuracy": 0.9,
      "damage": 2300
    },
    "gaite_axe": {
      "range": [
        1,
        2
      ],
      "energyCost": 20,
      "maxBulletCount": 0,
      "suitability": [
        1,
        1,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "蓋特巨斧",
      "type": "single",
      "accuracy": 0.7,
      "damage": 3700
    },
    "gaite_beam": {
      "range": [
        1,
        3
      ],
      "energyCost": 50,
      "maxBulletCount": 0,
      "suitability": [
        1,
        0.5,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "蓋特光束",
      "type": "single",
      "accuracy": 0.7,
      "damage": 5000
    },
    "gaite_cannon": {
      "range": [
        2,
        6
      ],
      "energyCost": 0,
      "maxBulletCount": 6,
      "suitability": [
        1,
        1,
        1,
        1
      ],
      "ablitity": [],
      "energyType": "bullet",
      "title": "蓋特加農",
      "type": "single",
      "accuracy": 0.6,
      "damage": 3000
    }
  },
  "robot": {
    "gaite": {
      "title": "蓋特",
      "weapons": [
        "gaite_handSword",
        "gaite_axe",
        "gaite_beam",
        "gaite_cannon"
      ],
      "hp": 3300,
      "en": 160,
      "armor": 1200,
      "power": 6,
      "cost": 4000
    },
    "jimu": {
      "title": "jimu",
      "weapons": [
        "bean_sword",
        "bean_gatling",
        "bean_gun"
      ],
      "hp": 2000,
      "en": 120,
      "armor": 1000,
      "power": 6,
      "cost": 1200
    },
    "zGundam": {
      "title": "Z鋼彈",
      "weapons": [
        "bean_sword",
        "bean_gatling",
        "bean_gun",
        "bean_bigGun"
      ],
      "hp": 2700,
      "en": 160,
      "armor": 1200,
      "power": 6,
      "cost": 3000
    }
  }
}

module.exports = dataJson