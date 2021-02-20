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
| VITE_APP_API_URL       | API URL (typically \$VITE_APP_URL/api/) |
| VITE_APP_AUTH_URL      | Authentication service URL               |
| VITE_APP_CLIENT_SECRET | Authentication service client secret     |
| VITE_APP_CLIENT_ID     | Authentication service client ID         |
| VITE_APP_OSCAR_LINK    | Authorization URL                        |

## Running

Run `yarn` and `yarn dev` 🚀

# Contributing

Please send an MR for any cool features or changes you think we could benefit from 💕

# Deployment with now.sh from Zeit

Want to run UNICORN yourself? Awesome! Currently we've implemented support for GitLab with GitLab Runner and now.sh. This can be seen in the .gitlab-ci file, but you will need to know about a few variables:

`ZEIT_BASE_DOMAIN` your default zeit root domain.

`NOW_TOKEN` your now.sh token, which should be set through your projects CI/CD settings. The token could be found through https://zeit.co/account/tokens

`NOW_ALIAS_PRODUCTION` is a comma separated strings describing the aliases now.sh should use for the production environment. This should be set in the CI/CD settings of your project.
