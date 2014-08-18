// streamer.js
var GitHub      = require('github'),
    Redis       = require('redis'),
    geocoder    = require('geocoder'),
    credentials = require('./credentials.json');

var EVENT_QUEUE  = 'event_queue';
var USER_CACHE   = 'user_cache';
var GEO_CACHE    = 'geo_cache';

var GITHUB_MIN_LIMIT = 4200;

var maxEventId = 0;

var stats = {
  events: 0,
  dupEvents: 0,
  locations: 0,

  userCacheHits: 0,
  userCacheMisses: 0,

  geoQueryLimitSkips: 0,
  geoCacheHits: 0,
  geoCacheMisses: 0
};

var redis = Redis.createClient();
redis.on('error', function (err) {
  console.log('Error ' + err);
});

var github = new GitHub({
  // required
  version: "3.0.0",
  // optional
  // debug: true,
  protocol: "https",
  // host: "sig.gy",
  timeout: 5000
});

github.authenticate({
  type: "oauth",
  key: credentials.github_oauth_key,
  secret: credentials.github_oauth_secret
});

var backoff = 1000;
var nextTry = 0;
function geocode(userLocation, callback) {
  if (!userLocation) {
    return;
  }
  stats.locations++;
  redis.hget(GEO_CACHE, userLocation, function (err, json) {
    if (json != null) {
      stats.geoCacheHits++;
      return callback(0, JSON.parse(json));
    }

    stats.geoCacheMisses++;

    if (new Date().getTime() < nextTry) {
      stats.geoQueryLimitSkips++;
      return;
    }

    geocoder.geocode(userLocation, function (err, data) {
      if (data.status == "OVER_QUERY_LIMIT") {
        stats.geoQueryLimitSkips++;
        console.log("geocode: sleeping for " + backoff / 1000 + " seconds");
        nextTry = new Date().getTime() + backoff;
        backoff *= 2;
      } else if (data.status == "OK") {
        redis.hset(GEO_CACHE, userLocation, JSON.stringify(data));
        backoff = 1000;
        nextTry = 0;
        callback(0, data);
      }
    });

  });
}

function getUser(actor, callback) {
  redis.hget(USER_CACHE, actor.id, function (err, json) {
    if (json != null) {
      stats.userCacheHits++;
      return callback(0, JSON.parse(json));
    }

    stats.userCacheMisses++;

    github.user.getFrom({user: actor.login}, function (err, user) {
      redis.hset(USER_CACHE, user.id, JSON.stringify(user));
      callback(0, user);

      console.log('x-ratelimit-remaining: ' + user.meta['x-ratelimit-remaining']);
      if (parseInt(user.meta['x-ratelimit-remaining']) < GITHUB_MIN_LIMIT) {
        clearInterval(poll);
      }
    });
  });
}

var poll = setInterval(function() {
  github.events.get({}, function(err, events) {
    sortedEvents = events.sort(function (a,b) {
      return parseInt(a.id) - parseInt(b.id);
    });

    sortedEvents.forEach(function(event) {
      if (maxEventId > parseInt(event.id)) {
        stats.dupEvents++;
        return;
      }
      maxEventId = parseInt(event.id);

      stats.events++;
      console.log('event: ' + event.id);

      getUser(event.actor, function(err, user) {
        geocode(user.location, function (err, geoData) {
          console.log('event: ' + event.id);
          console.log('user: ' + user.login);
          console.log('location: ' + user.location);
          console.log('geo: ' + JSON.stringify(geoData.results[0].geometry.location));


          redis.publish(EVENT_QUEUE, JSON.stringify({
            event: event,
            user: user,
            geo: geoData.results[0].geometry.location
          }));
        });
      });
    });

    console.log('x-ratelimit-remaining: ' + events.meta['x-ratelimit-remaining']);
    if (parseInt(events.meta['x-ratelimit-remaining']) < GITHUB_MIN_LIMIT) {
      clearInterval(poll);
    }
  });

  console.log(stats);
}, 1000);
