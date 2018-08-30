#!/bin/bash

echo "Checking ganache client..."

PID=`pgrep -f "ganache-cli"`

if [[ -z $PID ]]; then
  echo "Could not find existing ganache client so starting new one..."
  `node_modules/.bin/ganache-cli --noVMErrorsOnRPCResponse >/dev/null 2>&1`
else
  echo "Found existing ganache client with PID=$PID"
fi
