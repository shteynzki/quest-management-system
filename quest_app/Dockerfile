FROM ruby:3.4.8-slim

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    git \
    libpq-dev \
    libyaml-dev \
    pkg-config \
    tesseract-ocr \
    tesseract-ocr-rus \
    tesseract-ocr-eng \
    imagemagick \
    fontconfig \
    libxrender1 \
    libxext6 \
    libx11-6 \
    && rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV BUNDLE_PATH="/usr/local/bundle"

COPY Gemfile Gemfile.lock ./

RUN bundle lock --add-platform x86_64-linux && \
    bundle install

COPY . .

RUN chmod +x bin/* && \
    sed -i "s/\r$//g" bin/* && \
    sed -i 's/ruby\.exe$/ruby/' bin/*

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]