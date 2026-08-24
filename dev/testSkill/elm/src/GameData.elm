module GameData exposing (initialShop, initialMissions, enemyAssembliesForMission, testMission, testPlayerDeployments)

import Types exposing (..)

-- 對應 data/mecha_frames.md, pilots.md, weapons.md, parts.md 商店清單

grade : String -> Grade
grade s =
    case s of
        "S" -> S
        "A" -> A
        "B" -> B
        "C" -> C
        "D" -> D
        _ -> E

slot : String -> WeaponSlotTag
slot s =
    case s of
        "Hand" -> Hand
        "Shoulder" -> Shoulder
        _ -> Internal

ad : String -> String -> String -> String -> String -> Adaptability
ad land mountain sea air space =
    { land = grade land
    , mountain = grade mountain
    , sea = grade sea
    , air = grade air
    , space = grade space
    }

armor : Int -> Int -> Int -> Int -> Int -> ArmorMatrix
armor fire elec beam kin chem =
    { fire = fire, elec = elec, beam = beam, kin = kin, chem = chem }

-- ---------- 機體 (mecha_frames.md) ----------
initialMechas : List MechaFrame
initialMechas =
    [ { id = "M001"
      , name = "Blue Squuid"
      , nameTw = "蒼藍魚人"
      , size = "M"
      , description = "水陸兩用中型機，擅長海域作戰。"
      , price = 12000
      , maxHp = 320
      , maxEn = 180
      , enRegen = 25
      , baseMov = 6
      , weightLimit = 120
      , weaponSlots = [ Hand, Shoulder ]
      , partSlots = 2
      , adaptability = ad "B" "C" "S" "D" "E"
      , armorMatrix = armor 40 5 10 20 15
      }
    , { id = "M002"
      , name = "Land Grunt"
      , nameTw = "陸戰型"
      , size = "M"
      , description = "泛用陸戰機體，成本低、易量產。"
      , price = 8000
      , maxHp = 280
      , maxEn = 120
      , enRegen = 15
      , baseMov = 5
      , weightLimit = 100
      , weaponSlots = [ Hand, Hand, Shoulder ]
      , partSlots = 2
      , adaptability = ad "A" "B" "D" "E" "E"
      , armorMatrix = armor 20 10 15 25 20
      }
    , { id = "M003"
      , name = "Scout Lite"
      , nameTw = "輕量斥候"
      , size = "S"
      , description = "高機動偵察用，載重與武裝槽較少。"
      , price = 6000
      , maxHp = 200
      , maxEn = 150
      , enRegen = 22
      , baseMov = 8
      , weightLimit = 60
      , weaponSlots = [ Hand, Internal ]
      , partSlots = 1
      , adaptability = ad "A" "A" "C" "B" "D"
      , armorMatrix = armor 12 8 8 10 10
      }
    ]

-- ---------- 駕駛 (pilots.md) ----------
initialPilots : List PilotProfile
initialPilots =
    [ { id = "P001"
      , name = "Blue Ace"
      , nameTw = "蒼藍王牌"
      , rank = "Ace"
      , description = "擅長水域作戰的駕駛，與蒼藍魚人相性佳。"
      , price = 5000
      , melee = 14
      , ranged = 10
      , reflex = 16
      , technique = 12
      , currentWillpower = 100
      , spiritSkills = [ "FOCUS", "ACCEL", "COUNTER" ]
      , passiveAbilities = [ "SEA_AFFINITY" ]
      }
    , { id = "P002"
      , name = "Line Pilot"
      , nameTw = "泛用兵"
      , rank = "Sergeant"
      , description = "標準訓練出身的量產駕駛。"
      , price = 2000
      , melee = 10
      , ranged = 10
      , reflex = 10
      , technique = 10
      , currentWillpower = 80
      , spiritSkills = [ "FOCUS", "TRUST" ]
      , passiveAbilities = []
      }
    , { id = "P003"
      , name = "Cold Eye"
      , nameTw = "冷眼"
      , rank = "Specialist"
      , description = "專精遠距與定點射擊，適合 Overwatch／Snipe。"
      , price = 6500
      , melee = 6
      , ranged = 18
      , reflex = 14
      , technique = 16
      , currentWillpower = 90
      , spiritSkills = [ "FOCUS", "HIT", "SPIRIT" ]
      , passiveAbilities = [ "SNIPE_ACCURACY" ]
      }
    , { id = "P004"
      , name = "Assault Fist"
      , nameTw = "突擊之拳"
      , rank = "Ace"
      , description = "偏好近戰與高機動接敵。"
      , price = 5500
      , melee = 18
      , ranged = 8
      , reflex = 14
      , technique = 12
      , currentWillpower = 95
      , spiritSkills = [ "ACCEL", "STRIVE", "COUNTER" ]
      , passiveAbilities = [ "MELEE_CRIT_BONUS" ]
      }
    ]

-- ---------- 武器 (weapons.md) ----------
initialWeapons : List WeaponProfile
initialWeapons =
    [ { id = "W001"
      , name = "Ion Trident"
      , nameTw = "離子三叉戟"
      , weight = 18
      , price = 4200
      , slotTag = slot "Hand"
      , atkVector = "Kin 50, Elec 30"
      , stance = "Melee"
      , rngMin = 1
      , rngMax = 1
      , accuracyMod = 5
      , enCost = 15
      , maxAmmo = -1
      }
    , { id = "W002"
      , name = "Assault Rifle"
      , nameTw = "突擊步槍"
      , weight = 12
      , price = 2800
      , slotTag = slot "Hand"
      , atkVector = "Kin 45"
      , stance = "Assault"
      , rngMin = 2
      , rngMax = 5
      , accuracyMod = 0
      , enCost = 0
      , maxAmmo = 24
      }
    , { id = "W003"
      , name = "Shoulder Beam Cannon"
      , nameTw = "肩載光束砲"
      , weight = 22
      , price = 5500
      , slotTag = slot "Shoulder"
      , atkVector = "Beam 55"
      , stance = "Direct_Fire"
      , rngMin = 3
      , rngMax = 7
      , accuracyMod = -5
      , enCost = 35
      , maxAmmo = -1
      }
    , { id = "W004"
      , name = "Long-Range Sniper"
      , nameTw = "長程狙擊"
      , weight = 20
      , price = 7200
      , slotTag = slot "Shoulder"
      , atkVector = "Kin 70"
      , stance = "Snipe"
      , rngMin = 4
      , rngMax = 10
      , accuracyMod = 10
      , enCost = 20
      , maxAmmo = 8
      }
    , { id = "W005"
      , name = "Internal Machine Gun"
      , nameTw = "內藏機槍"
      , weight = 8
      , price = 1500
      , slotTag = slot "Internal"
      , atkVector = "Kin 25"
      , stance = "Assault"
      , rngMin = 1
      , rngMax = 3
      , accuracyMod = 5
      , enCost = 0
      , maxAmmo = 40
      }
    , { id = "W006"
      , name = "Heat Saber"
      , nameTw = "熱能軍刀"
      , weight = 10
      , price = 3200
      , slotTag = slot "Hand"
      , atkVector = "Kin 35, Fire 25"
      , stance = "Melee"
      , rngMin = 1
      , rngMax = 1
      , accuracyMod = 10
      , enCost = 8
      , maxAmmo = -1
      }
    ]

-- ---------- 配件 (parts.md) ----------
initialParts : List PartProfile
initialParts =
    [ { id = "PT001"
      , name = "Hydro Turbine"
      , nameTw = "水流推進器"
      , weight = 15
      , price = 3800
      , passiveDraw = 5
      , hpBonus = 0
      , adaptabilityModifiers = []
      }
    , { id = "PT002"
      , name = "Armor Liner"
      , nameTw = "裝甲襯板"
      , weight = 20
      , price = 2500
      , passiveDraw = 0
      , hpBonus = 50
      , adaptabilityModifiers = []
      }
    , { id = "PT003"
      , name = "High-Mobility Thruster"
      , nameTw = "高機動推進器"
      , weight = 18
      , price = 4500
      , passiveDraw = 12
      , hpBonus = 0
      , adaptabilityModifiers = [ ( "Air", A ) ]
      }
    , { id = "PT004"
      , name = "Shield Capacitor"
      , nameTw = "護盾電容"
      , weight = 14
      , price = 5200
      , passiveDraw = 8
      , hpBonus = 0
      , adaptabilityModifiers = []
      }
    , { id = "PT005"
      , name = "Targeting Assist Unit"
      , nameTw = "瞄準輔助"
      , weight = 6
      , price = 2800
      , passiveDraw = 3
      , hpBonus = 0
      , adaptabilityModifiers = []
      }
    , { id = "PT006"
      , name = "Lightweight Frame"
      , nameTw = "輕量框架"
      , weight = 0
      , price = 3500
      , passiveDraw = 0
      , hpBonus = 0
      , adaptabilityModifiers = []
      }
    ]

initialShop : Shop
initialShop =
    { mechas = initialMechas
    , pilots = initialPilots
    , weapons = initialWeapons
    , parts = initialParts
    }


at : Int -> List a -> Maybe a
at i list =
    List.drop i list |> List.head


-- ---------- 測試戰鬥用：固定任務與隨機感派擊（雙方多樣配置） ----------
testMission : Mission
testMission =
    { id = "TEST"
    , name = "Test Battle"
    , nameTw = "測試戰鬥"
    , context = "快速測試戰鬥，雙方為預設機體與武裝。"
    , mapSizeX = 14
    , mapSizeY = 10
    , weatherTag = "Clear"
    , deploymentLimit = 4
    , winCondition = "Extermination"
    , loseCondition = "Wipeout"
    , rewardMoney = 0
    }


testPlayerDeployments : List Assembly
testPlayerDeployments =
    [ testAssemblyMelee, testAssemblyCharge, testAssemblyShooter, testAssemblySniper ]


-- 格鬥機：雙近戰武器可切換（離子三叉戟、熱能軍刀）
testAssemblyMelee : Assembly
testAssemblyMelee =
    { mecha = Maybe.withDefault enemyMechaGrunt (at 1 initialMechas)
    , pilot = at 3 initialPilots  -- Assault Fist 突擊之拳
    , weapons = List.filterMap identity [ at 0 initialWeapons, at 5 initialWeapons ]
    , parts = List.filterMap identity [ at 1 initialParts ]
    }


-- 衝鋒機：突擊步槍 + 熱能軍刀 + 肩載光束砲（中近距可切換）
testAssemblyCharge : Assembly
testAssemblyCharge =
    { mecha = Maybe.withDefault enemyMechaGrunt (at 1 initialMechas)
    , pilot = at 0 initialPilots
    , weapons = List.filterMap identity [ at 1 initialWeapons, at 5 initialWeapons, at 2 initialWeapons ]
    , parts = List.filterMap identity [ at 2 initialParts ]
    }


-- 射擊機：突擊步槍 + 肩載光束砲 + 長程狙擊（中遠距可切換）
testAssemblyShooter : Assembly
testAssemblyShooter =
    { mecha = Maybe.withDefault enemyMechaGrunt (at 1 initialMechas)
    , pilot = at 1 initialPilots
    , weapons = List.filterMap identity [ at 1 initialWeapons, at 2 initialWeapons, at 3 initialWeapons ]
    , parts = List.filterMap identity [ at 4 initialParts ]
    }


-- 狙擊機：長程狙擊 + 肩載光束砲 + 突擊步槍（遠中近可切換）
testAssemblySniper : Assembly
testAssemblySniper =
    { mecha = Maybe.withDefault enemyMechaGrunt (at 1 initialMechas)
    , pilot = at 2 initialPilots  -- Cold Eye 冷眼
    , weapons = List.filterMap identity [ at 3 initialWeapons, at 2 initialWeapons, at 1 initialWeapons ]
    , parts = List.filterMap identity [ at 4 initialParts ]
    }


-- ---------- 任務 (missions.md) ----------
initialMissions : List Mission
initialMissions =
    [ { id = "M-01"
      , name = "Rust Harbor Assault"
      , nameTw = "鐵鏽港突襲"
      , context = "敵方運輸艦在港口擱淺，趁潮汐低位發動進攻。"
      , mapSizeX = 30
      , mapSizeY = 30
      , weatherTag = "Rain"
      , deploymentLimit = 4
      , winCondition = "Extermination"
      , loseCondition = "Wipeout"
      , rewardMoney = 8000
      }
    ]


-- ---------- 敵方單位 (missions.md M-01) ----------
enemyAssembliesForMission : String -> List Assembly
enemyAssembliesForMission missionId =
    if missionId == "M-01" then
        List.repeat 3 enemyStandardGuard ++ [ enemyArtillery ]
    else if missionId == "TEST" then
        -- 測試戰鬥：敵方與我方同樣四種機型（格鬥、衝鋒、射擊、狙擊）
        testPlayerDeployments
    else
        []


enemyStandardGuard : Assembly
enemyStandardGuard =
    { mecha = enemyMechaGrunt
    , pilot = Just enemyPilotGrunt
    , weapons = [ assaultRifleRef ]
    , parts = []
    }


enemyArtillery : Assembly
enemyArtillery =
    { mecha = enemyMechaGrunt
    , pilot = Just enemyPilotGrunt
    , weapons = [ shoulderBeamRef ]
    , parts = []
    }


enemyMechaGrunt : MechaFrame
enemyMechaGrunt =
    { id = "E001"
    , name = "Land Guard"
    , nameTw = "陸戰守衛"
    , size = "M"
    , description = "敵方量產機"
    , price = 0
    , maxHp = 200
    , maxEn = 100
    , enRegen = 10
    , baseMov = 4
    , weightLimit = 80
    , weaponSlots = [ Hand, Hand, Shoulder ]
    , partSlots = 0
    , adaptability = ad "A" "B" "D" "E" "E"
    , armorMatrix = armor 15 8 10 18 12
    }


enemyPilotGrunt : PilotProfile
enemyPilotGrunt =
    { id = "EP01"
    , name = "Grunt"
    , nameTw = "雜兵"
    , rank = ""
    , description = ""
    , price = 0
    , melee = 8
    , ranged = 8
    , reflex = 8
    , technique = 8
    , currentWillpower = 50
    , spiritSkills = []
    , passiveAbilities = []
    }


assaultRifleRef : WeaponProfile
assaultRifleRef =
    { id = "W002"
    , name = "Assault Rifle"
    , nameTw = "突擊步槍"
    , weight = 12
    , price = 2800
    , slotTag = Hand
    , atkVector = "Kin 45"
    , stance = "Assault"
    , rngMin = 2
    , rngMax = 5
    , accuracyMod = 0
    , enCost = 0
    , maxAmmo = 24
    }

shoulderBeamRef : WeaponProfile
shoulderBeamRef =
    { id = "W003"
    , name = "Shoulder Beam Cannon"
    , nameTw = "肩載光束砲"
    , weight = 22
    , price = 5500
    , slotTag = Shoulder
    , atkVector = "Beam 55"
    , stance = "Direct_Fire"
    , rngMin = 3
    , rngMax = 7
    , accuracyMod = -5
    , enCost = 35
    , maxAmmo = -1
    }
