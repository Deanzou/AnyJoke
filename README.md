# [Archive] AnyJoke

**Note:** *This repository is not under active development.*

# Overview

This app showcases use of Parse + React for a simple collaborative humor site. Users can sign up and either submit joke setups or punchlines, then vote on their favorite combinations.

You can check out the official hosted version at [anyjoke.parseapp.com](http://anyjoke.parseapp.com).

# Setup

1. Create a new app on Parse, and make sure you go through our [getting started guide for Cloud Code](https://parse.com/docs/cloud_code_guide#started-installing).

2. Type `parse new .` in the directory where this README resides, authenticate with your Parse credentials, and choose the app name you created.

3. Edit `config/global.json` and put in your Parse Application ID and Parse Master Key in the application setup section. You can find your app keys in your app settings page under "Application Keys". The Master Key is necessary for managing deploys.

4. Edit the `Parse.initialize` lines in `public/index.html` and `public/setup/index.html` to use your Parse Application ID and Parse Javascript Key (not your Master Key, since these files will be public).

4. Type `parse deploy`. This deploys your app to Parse.

5. Now, we'll need to configure the url where you can reach your app. Go to your app's setting page and set a unique subdomain for your Web Hosting url.

6. Go to yoursubdomain.parseapp.com and view your copy of AnyJoke!
