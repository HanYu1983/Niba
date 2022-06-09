const pl = require("planck-js")

function createWorld() {
    var world = pl.World(pl.Vec2(0, 100));

    //world.createBody().createFixture(pl.Edge(pl.Vec2(-40.0, 0.0), pl.Vec2(40.0, 0.0)));

    world.createBody(pl.Vec2(-4.0, 22.0), -0.25).createFixture(pl.Box(13.0, 0.25), 0.0);

    world.createBody(pl.Vec2(10.5, 19.0)).createFixture(pl.Box(0.25, 1.0), 0.0);

    world.createBody(pl.Vec2(4.0, 14.0), 0.25).createFixture(pl.Box(13.0, 0.25), 0.0);

    world.createBody(pl.Vec2(-10.5, 11.0)).createFixture(pl.Box(0.25, 1.0), 0.0);

    world.createBody(pl.Vec2(-4.0, 6.0), -0.25).createFixture(pl.Box(13.0, 0.25), 0.0);

    var friction = [0.75, 0.5, 0.35, 0.1, 0.0];

    var circle = pl.Box(5, 5);

    for (var i = 0; i < friction.length; ++i) {
        var ball = world.createDynamicBody(pl.Vec2(-15.0 + 4.0 * i, -28.0));
        ball.createFixture(circle, {
            density: 25.0,
            friction: friction[i]
        });
        ball.applyAngularImpulse(1000000, true)
    }

    const body = world.createDynamicBody(pl.Vec2(200, 100)).createFixture(pl.Box(10, 10), {
        density: 25.0
    })



    return world;
}

module.exports = createWorld