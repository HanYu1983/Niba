import pool.Pool;

@:build(pool.macro.PoolBuilder.build('assets'))
class GlobalPool extends Pool {}
