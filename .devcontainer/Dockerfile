FROM node:24 AS base

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    git \
    curl \
    nano \
    man \
    sudo \
    jq \
    bash-completion \
    && rm -rf /var/lib/apt/lists/* 


FROM base AS devcontainer

WORKDIR /workspace
# Create the vscode user
ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN deluser node \
    && cat /etc/passwd \ 
    && groupadd --force --gid $USER_GID $USERNAME \
    && useradd -mG sudo --uid $USER_UID --gid $USER_GID -s /usr/bin/bash $USERNAME \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER $USERNAME