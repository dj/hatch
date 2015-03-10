# Hatch

## Development Setup

### npm
Install [node](nodejs.org), which comes bundled with npm.

To install dependencies:
    npm install

To add a dependency
    npm install <package> --save
To add a development dependency
    npm install <package> --save-dev

### gulp
Gulp is a task runner / build tool. In general, source files in `src/` are preprocessed and written to `build/`

To run the default gulp task and then watch the `src/` directory for changes (You may have to add `node_modules/.bin` to your $PATH)
    gulp

Right now, gulp doesn't log anything when it recoveres from a broken build, which can be confusing.

### nginx
Install nginx with your favorite package manager.
We need to edit nginx.conf to do 2 things:
+ specify the root of our application
+ proxy API calls to our development server

In `/usr/local/etc/nginx/nginx.conf` find the `location /` directive and edit the root location like so

    location /  {
        root /Users/foo/dev/hatch/build; # absolute path to build directory
        index index.html index.html;
    }

In the same file, add the following location directive to proxy API calls to the server (assuming you have it set up and running on port 5000)

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
    }

## TODO
  + get sourcemaps working for sensible debugging
  + make gulp log something useful when it successfully builds
