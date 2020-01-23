const dataJson = {
    "weaponType": {
        "single": {
            "title": "single"
        },
        "line": {
            "title": "line"
        }
    },
    "weaponAbility": {
        "moveAttack": {
            "title": "move attack"
        }
    },
    "weaponEnergyType": {
        "energy": {
            "title": "energy"
        },
        "bullet": {
            "title": "bullet"
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
        }
    },
    "robot": {
        "jimu": {
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
        }
    }
}

module.exports = dataJson