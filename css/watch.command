#!/bin/bash
cd "$( dirname "$0" )"
chmod 777 watch.command
sass --watch sass/style.scss:style.css