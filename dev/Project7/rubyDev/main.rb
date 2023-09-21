require 'speculation'
require 'speculation/test'
require 'speculation/gen'

S = Speculation
Gen = S::Gen
STest = S::Test

def self.main
    extend Speculation::NamespacedSymbols

    # puts self
    # puts ns(:wow)
    # puts ns(S, :wow)

    S.def :"common/position", S.tuple(Float, Float)
    S.def :"common/positionComponent", S.keys(:req_un => [:"common/position"])

    S.explain :"common/position", [0.0, 2.0]
end

main

puts methods.inspect
puts singleton_methods.inspect
puts object_id
p self
p self.class
p Object.new.object_id


second = Object.new
def second.main
    extend Speculation::NamespacedSymbols
    S.def :"common/position", S.tuple(Float, Float)
    S.def :"common/positionComponent", S.keys(:req_un => [:"common/position"])

    S.explain :"common/position", [0.0, 2.0]
end

second.main
puts second.method(:ns)


# module Position
#     attr_accessor :position
#     def initPosition
#         @position = [0.0, 0.0]
#     end
# end

# module Velocity
#     attr_accessor :velocity
#     def initVelocity
#         @velocity = [0.0, 0.0]
#     end
#     def updateVelocity

#     end
# end

# class System
#     def addListener

#     end
# end

# class Monster
#     include Position
#     include Velocity
#     def initialize
#         initPosition
#         initVelocity
#     end
# end

# enemy = Monster.new
# puts enemy.position

#
def createMonster
    return {
        id: 30,
        position: [0.0,0.0],
        velocity: [0.0,0.0],
    }
end

def createSpawn
    return {

    }
end

def createWeapon
    return {
        id: 40,
        towerId: 20,
        spawn: createSpawn
    }
end

def createTower
    return {
        id: 20,
        position: [0.0, 0.0],
    }
end

def createStage
    return {
        entities: [],
    }
end

def createMethod(keys)
    keys.each { |key|
        define_method "get_#{key}" do |obj|
            obj[key]
        end
        define_method "set_#{key}" do |obj, v|
            obj[key] = v
            obj
        end
    }
end

createMethod([:position])
puts (
    set_position({}, 20)
        .then { |x| get_position(x) }
)

