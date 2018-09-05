FROM node:8.10

RUN apt-get update && \
  apt-get -y install \
  zip \
  groff \
  libssl-dev \
  python-pip \
  python-dev && \
  pip install awscli --upgrade

ENV HOME=/home/node
ENV NODE_ENV=development

WORKDIR $HOME/app
RUN ln -sf /usr/share/zoneinfo/Europe/Bratislava /etc/localtime && \
  dpkg-reconfigure -f noninteractive tzdata && \
  mkdir -p $HOME/app/node_modules $HOME/.aws && \
  chown -R node:node $HOME

USER node
