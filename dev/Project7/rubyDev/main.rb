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