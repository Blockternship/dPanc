#!/bin/bash

echo "Stopping ganache client..."

PID=`pgrep -f "ganache-cli"`

if [[ -z $PID ]]; then
  echo "Ganache client already stopped!"
else
  kill $PID
  echo "Killed Ganache client at PID $PID."
fi
