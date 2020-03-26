
x = your version !!!

//Windows 10

    //dev-standalone
        "C:\Program Files\MongoDB\Server\4.x\bin\mongod.exe"
        OR
        mongod

    //dev
        "C:\Program Files\MongoDB\Server\4.x\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg"
        OR
        mongod --config "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg"
        
        log: C:\Program Files\MongoDB\Server\4.x\log\mongod.log


//Win10 Development - Replica set configure

    - allow write ops (in folder settings) for "C:\Program Files\MongoDB\"
    - to make it easier - u can add environment variable as Path: "C:\Program Files\MongoDB\Server\4.x\bin\" - now u can type just 'mongod'
    - add (<> means process variable) in: "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg":

        replication:
            replSetName: <process.env.REPLICA_NAME>

    - if you added win env var, run: 
        mongod --config "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg"
    - if not, run: 
        "C:\Program Files\MongoDB\Server\4.x\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg"
    - u can see log (C:\Program Files\MongoDB\Server\4.x\log\mongod.log), if server is active
    - run in new terminal: mongo
    - next run: 
        rs.initiate( {
            _id : <process.env.REPLICA_NAME>,
            members: [
                { _id: 0, host: "127.0.0.1:27017", priority: 3, votes: 1 },
            ]
        })
    - to check is it ok run: rs.status()
    - to display configuration: rs.config()
    - check: rs.status()
    - more: 
        https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/
        https://docs.mongodb.com/manual/tutorial/deploy-replica-set/
        https://docs.mongodb.com/manual/tutorial/expand-replica-set/
    - to make additional nodes, u need create separated instances (server folders), with own config, and start them from cmd
    - next u can add nodes to config: rs.add(...)