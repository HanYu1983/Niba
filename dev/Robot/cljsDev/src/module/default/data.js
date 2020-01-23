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
    "beangun": {
      "range": [
        2,
        5
      ],
      "energyCost": 20,
      "maxBulletCount": 8,
      "suitability": [
        1,
        0,
        1,
        1
      ],
      "ablitity": [
        "moveAttack"
      ],
      "energyType": "energy",
      "title": "bean gun",
      "type": "single",
      "accuracy": 0.7,
      "damage": 3000
    },
    "bigsword": {
      "range": [
        1,
        2
      ],
      "energyCost": 20,
      "maxBulletCount": 8,
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
      "title": "big sword",
      "type": "line",
      "accuracy": 0.9,
      "damage": 2000
    },
    "gaite_handsword": {
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
    "jimu2": {
      "title": "jimu",
      "weapons": [
        "beangun",
        "bigsword"
      ],
      "hp": 2000,
      "en": 120,
      "armor": 1000,
      "power": 7,
      "cost": 3000
    },
    "jimu": {
      "title": "蓋特",
      "weapons": [
        "gaite_handsword",
        "gaite_axe",
        "gaite_beam",
        "gaite_cannon"
      ],
      "hp": 3300,
      "en": 120,
      "armor": 1200,
      "power": 12,
      "cost": 4000
    }
  }
}

module.exports = dataJson