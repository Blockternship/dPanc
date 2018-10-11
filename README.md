 
# dPanc
Self Health Management dApp for Diabetes

# Overview

We wanted to tackle the initial challenge of being able to put medical data on the blockchain, and specifically data regarding type one diabetes. We are looking to give the average diabetic tools to better manage their health using a decentralized platform that stood objectively for their health, rather than the interests of the healthcare industry.

The existing medical prescription leaves a lot to be desired. Endocrinologists simply give their diabetic patients a linear equation that was interpolated from the patient’s recent medical data. But this linear equation ignores the fact that modern humans live very dynamic lives, and thus many diabetics self-prescribe their own tools and methods for dealing with the non-linear nature of the human experience.

We can bring engineers, diabetics, and health experts together to create an open sourced and decentralized diabetes management system. Through the analysis of medical data stored on an immutable ledger, we can provide the data to build these tools and iterate on them. We are confident that we can create dynamic models that can easily outperform the existing linear prescription, thus giving diabetics around the world more control over their health.

We would also like to explore an abstraction of this idea. The notion of individual people voluntarily providing their own data in order to help create a decentralized solution to a major world problem.

## Philosophy

We believe that the burden of type one diabetes can be significantly reduced if patients were given the appropriate tools to manage their health. But the tools being prescribed by doctors are inadequate, and the centralization of these tools make changes slow and ineffective. If individual patients shared their medical data to support the creation of these decentralized tools, we can bring the ability to enact change to the people whom it will affect the most.

## Features

The features list is split into the user-facing web application, backend services, and contracts.

### Web Application

<img align="center" src="./docs/images/upload_view.png" />

- Full statistics in a dashboard on time weighted glucose averages 
- The dashboard also includes max velocity of the user's blood glucose, user's Hemoglobin A1c, and other statistics around the user's blood glucose values 
- Manage gas fees and any transaction with full MetaMask integration to allow the user to create an entry of data, retrieve analysis around their data, and eventually earn tokens for their data!)
- Research pages to comparison metrics to benchmark your averages as well as description regarding what what the purpose of our work is as well as what the methodology is behind each of our analysis pieces. 
- Upload page which consists of a form which has integrated with MetaMask initiating our smart contract to put the user's data onto the blockchain


## Backend Services & Processes


## Contracts


## Next Steps

As this was only a hackathon, there are still many improvements that can be made to dPanc (decentralized Pancreas)

Here is a list of major improvements that we wish we had time to implement:
- Better UI/UX design (we focused on building functionality as opposed to designing UI/UX)
- 
- Tokenization of dPanc and generating reward structure for users 
- Incorporating advanced calculations around blood glucose and Hemoglobin A1c


## What We Learned

As this was our second project that incorporated blockchain, specifically Ethereum, as well as our first time utilizing OrbitDB and smart contracts, and we wanted to share the major accomplishments and learnings from this hackathon:
- How the Ethereum network works
- 
- 
- 

# Features
- MetaMask and uPort integration for registering users
- Calculate metrics and statistics for blood glucose levels:
    - min, max, and avg
    - velocity
- Anomaly detection through highlighting target ranges

# Tech Stack
- Node.js & Express.js backend server
- React.js frontend
- OrbitDB (IPFS) for data storage
- Solidity & Truffle for contract development and deployment

# Flow
![Data Flow](docs/images/data_flow.png)

## Local Development

1. `nvm use`
2. `yarn`
3. `yarn start:dev`

You'll need to make sure you have `nvm` installed and the proper version of node (`9.X`)

### Installing nvm and the required version of node

1. `npm install -g nvm`
2. `nvm install 9`


## Contracts

1. `cd contracts && yarn`
2. `yarn test:contracts`
