Hubstream
===========

Streaming Github events

To run

    export REDISTOGO_URL=redis://username:password@host:port/
    web: node web.js
    streamer: node streamer.js

Local

    git clone git@github.com:agentidea/hubstream.git
    git checkout redisstream
    at root dir eg: ( cd redisstream )
    sudo npm install
    

Deploy

    we chose to run node on an ubuntue server 
    to make for a robust deployemnt, we recommend
    upstart and monit
    see conf.d folder for init scripts 
    
monit/upstart instructions by 
[Tim Smart](https://github.com/Tim-Smart) - [here](http://howtonode.org/deploying-node-upstart-monit)

##Authors

Grant Steinfeld

Oren Kredo
