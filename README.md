Hubstream
===========

Streaming Github events on a Google Map

Local

    git clone git@github.com:agentidea/hubstream.git
    git checkout visualizations

    at root dir eg: ( cd hubstream )
    sudo npm install
    sudo npm install -g underscore
    sudo npm install -g typescript
    sudo npm install -g grunt
    sudo npm install -g yo
    sudo npm install -g generator-angular

    install bower components ( ie angular and bootstrap )
    change into the angular app dir eg: ( cd hubstream/app )
    yo angular




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
