const Aerospike = require('aerospike')
const op = Aerospike.operations
const lists = Aerospike.lists
const key = new Aerospike.Key('test', 'demo', 'mykey1')
// INSERT HOSTNAME AND PORT NUMBER OF AEROSPIKE SERVER NODE HERE!
var config = {
    hosts: 'localhost:3000',
    // Timeouts disabled, latency dependent on server location. Configure as needed.
    policies: {
        write: new Aerospike.WritePolicy({ socketTimeout: 0, totalTimeout: 0 }),
        operate: new Aerospike.OperatePolicy({ socketTimeout: 0, totalTimeout: 0 })
    }
}
var ops = [
    lists.append('tags', 'orange'),
    op.read('tags')
]

Aerospike.client(config).connect((error, client) => {
    if (error) throw error
    client.put(key, { tags: ['blue', 'yellow', 'pink'] }, (error) => {
        if (error) throw error
        client.operate(key, ops, (error, result) => {
            if (error) throw error
            console.log(result.bins.tags) // => [ 'blue', 'yellow', 'pink', 'orange' ]
            client.close()
        })
    })
})