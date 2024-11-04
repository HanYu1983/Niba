
const Bonus = {
  ...Tool.createAttrs(["id", "description"])
}

const Action = {
  ...Tool.createAttrs(["id", "description"])
  getTimes: (self)-> self.times || 1
  getBonus: (self)-> []
  getEnergyCost: (self)-> self.energyCost || 5
  getBulletCost: (self)-> self.bulletCost || 1
  isCostEnergy: (self)-> self.energyCost != null
  isCostBullet: (self)-> self.bulletCost != null
  getAttackRange: (self)-> []
  getWeapon: (self)-> self.weapon
}

const Weapon = {
  ...Tool.createAttrs(["id", "description"])
  hasEnergyPack: (self)-> self.energy != null
  getActions: (self)-> self.actions || []
  createAll: ->
    _ =
      * energy: 100
        actions:
        * times: 3
          energyCost: 10
          weapon: self
        * times: 1
          energyCost: 30
          weapon: self
        * times: 30
          bulletCost: 1
      * actions: []
}

const Component = {
  ...Tool.createAttrs(["id", "energy", "description"])
  isFireArmor:(self)->self.fireArmor != null
  isIceArmor:(self)->self.iceArmor != null
  isArmor:(self)-> window.Component.isFireArmor(self) || window.Component.isIceArmor(self)
  isEnergyPack:(self)->self.energy != null
  getArmor:(self)-> self.iceArmor || self.fireArmor
  isShield:(self)-> self.shield
  createAll:->
    _ = 
      * id: ""
        fireArmor: 40
      * id: ""
        iceArmor: 30
      * id: ""
        energy: 30
}

Component.createAll() 
  |> filter(Component.isFireArmor) 
  |> map(Component.getArmor) 
  |> reduce((+), 0)