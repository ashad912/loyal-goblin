
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
        mongod --config "C:\Program Files\MongoDB\Server\4.0\bin\mongod.cfg"
        mongod --config "C:\Program Files\MongoDB\Server\4.2\bin\mongod.cfg"
        
        log: C:\Program Files\MongoDB\Server\4.x\log\mongod.log



//Nginx config
    https://www.youtube.com/watch?v=eaA8Ol6I16w

    - sudo apt get install nginx
    - /var/www/<project> <- here set ur project
    - /etc/nginx/sites-available/<project_name_config_file>:
        server {
            listen 80 default_server;
            listen [::]:80 default_server;

            server_name <domain> <other_domain>;

            root /var/www/<project>;
            index index.html index.htm;

            location / {
                proxy_pass http://localhost:4000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                # try_files $uri $uri/ =404;
                }
            client_max_body_size 10M;
        }
    - delete 'default_server' phrases (second and third line) from '/etc/nginx/sites-available/default'
    - make link (shortcut) in '/etc/nginx/sites-enabled/' catalog:
        sudo ln -s /etc/nginx/sites-available/<project> /etc/nginx/sites-enabled/
    - sudo service nginx restart
    - git clone in 'var/www/<project>'
    - in project dir, install all packages (client and server)
    - install and config db (mongo)
    - build client
    - run server

//Mongo Ubuntu install

    - install mongodb (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
    - service mongod start <- run basic server
    - adjust (add server ip) config file in /etc/mongod.conf:
        net:
            port: 27017
            bindIp: 127.0.0.1, <server_ip>

    - connect (<server_ip>:27017) by Robo3T to create admin and root user accounts (set passwords)
    - enable auth in /etc/mongod.conf:
        security:
                authorization: enabled
    
    - to config replica set, look to 'MongoDB Replica set config' and edit mongod.conf
    - run: mongo admin -u '<username>' -p '<password>' //in quotes is safer (special chars)
    - look to 'MongoDB Replica set config' - rs.initiate(..) etc.



//Win10 Development - MongoDB Replica set config

    - allow write ops (in folder settings) for "C:\Program Files\MongoDB\"
    - to make it easier - u can add environment variable as Path (remember to swap "x" !!!): "C:\Program Files\MongoDB\Server\4.x\bin\" - now u can type just 'mongod'
    - add (<> means process variable) in (remember to swap "x" !!!): "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg":

        replication:
            replSetName: <process.env.REPLICA_NAME>

    - if you added win env var, run (remember to swap "x" !!!): 
        mongod --config "C:\Program Files\MongoDB\Server\4.x\bin\mongod.cfg"
    - if not, run (remember to swap "x" !!!): 
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
