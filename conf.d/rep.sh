echo "using sed to show easy replaces"
#cp ../streamer.js ./streamerBAK.js
sed 's/__HUBSTREAM_GITHUB_KEY/<<my clientID from git application>>/g' ../streamer.js
sed 's/__HUBSTREAM_GITHUB_SECRET/<<my Client Secret from git application>>/g' ../streamer.js
