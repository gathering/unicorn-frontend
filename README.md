<h1 align="center">UNICORN 🦄</h1>
<p align="center">Unified Net-based Interface for Competition Organization, Rules and News.</p>

# Motivation

At The Gathering, there has always been a tradition for creative competitions with music, graphics and demos. In 2014 we started working on a competition system to support the creative competitions at The Gathering, and their needs. Summed up, this was handling entries, qualifying/disqualifying, enabling an API for showing entries on stage, votes and results.
Over the years this has escalated a bit by taking on game competitions and achievements.

The system has been the victim of about 4 rewrites as we have learned a lot, and made a ton of mistakes. "About" because it kind of depends of how you count. This is hopefully the last complete rewrite, where we have separated the frontend into it's own service based on React.

# Getting started

To run UNICORN yourself, you pretty much just have to fork and clone this project (and a few other things).

At this point of time, you will need a UNICORN backend running, and an authentication service. The UNICORN backend will be open sourced later this year, but for now you will need access to a running instance.

## Environmentvariables

Add the necessary variables to your environment before continuing:

| Name                    | Description                              |
| ----------------------- | ---------------------------------------- |
| VITE_APP_URL           | Backend service URL                      |
| VITE_APP_CLIENT_SECRET | Authentication service client secret     |
| VITE_APP_CLIENT_ID     | Authentication service client ID         |

## Running

Run `yarn` and `yarn dev` 🚀

## Building

Run `yarn` and `yarn build`

## Hosting

Serve static files generated in the dist folder however you'd like:
- Web server like Nginx
- Newest CDN on the block

# Contributing

Please send a PR for any cool features or changes you think we could benefit from 💕
