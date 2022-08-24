puts "abc"

module Lib
    def self.doA
        puts "doA"
    end

    class A
    end

    def doA
        puts "doA", self
        def self.doB
            puts "doB"
        end
    end
end

puts Lib.const_get(:A)

class Car
    extend Lib
    self.doA
end

Car.doB