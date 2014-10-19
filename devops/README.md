Deploying Hubstream as a daemon via Upstart
===========================================
Install Upstart.

Use these upstart scripts to run the two services as daemons.
First, copy the upstart scripts into `/etc/init`. Then edit them for your application's directory locations and naming. Finally:

    sudo start hubstream-web
    sudo start hubstream-streamer 


Using Monit to maintain the services 
===========================================
Install Monit.

Instead of starting the services as shown above, turn them off and instead copy the monit scripts into `/etc/monit`. That's it! Within two minutes the services should restart. 
