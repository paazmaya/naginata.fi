# naginata.fi

> A web site in Finland for an ancient martial art from Japan.

All the code is under the [Creative Commons Attribution-ShareAlike 4.0 International Public License](https://creativecommons.org/licenses/by-sa/4.0/).
Full legal text also available in [`LICENSE` file](LICENSE).

[![Node.js CI](https://github.com/paazmaya/naginata.fi/actions/workflows/linting-and-unit-testing.yml/badge.svg)](https://github.com/paazmaya/naginata.fi/actions/workflows/linting-and-unit-testing.yml)
![Visual Regression Status](https://api.ghostinspector.com/v1/suites/5408c0312f4dd6df5ae50101/status-badge)
[![Netlify Status](https://api.netlify.com/api/v1/badges/1c6a708d-5ee5-4cd2-8e66-8cbdbfaa454d/deploy-status)](https://app.netlify.com/sites/naginata-finland/deploys)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=paazmaya_naginata.fi&metric=code_smells)](https://sonarcloud.io/dashboard?id=paazmaya_naginata.fi)

## About the martial art

Naginata is a weapon made of a long wooden stick on which a curved blade is attached.

The art of using this weapon is often called simply as Naginata, but more accurately
it can be called as Atarashii Naginata, in the case of the post-Meiji era standardised
version.

The method of using naginata as a weapon has existed much longer and some around 500 styles
have existed in the past.

Today these are still some ten active style, of which most of them contain other weapons
aside using just a naginata. In any case in these styles naginata is used against a sword.

This website will focus on the following two:

 * Atarashii Naginata (http://naginata.jp/)
 * Jikishinkageryu Naginatajutsu (http://www.jikishin-naginata.jp/)

## About this software project

The main reason for this website and this GitHub project is to learn to use the given
technologies and to promote the martial art.

The domain `naginata.fi` is privately registered to Jukka Paasonen.

Mari Paasonen has been kind enough to provide the Japanese translations for the content.

Leena Lecklin was kind enough to draw the `naginata-bogu-chudan-artwork-lecklin.png` picture
used in the _Atarashii Naginata_ page.

Contributors are welcome.

Any changes made to this GitHub repository, are automatically deployed to Netlify,
hence any content updates are visible via the web site almost immediately.

[![BrowserStack](./browserstack-logo.png) Cross browser testing kindly provided by BrowserStack.](https://www.browserstack.com/)

## Contributing

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://www.erikaheidi.com/blog/a-beginners-guide-to-open-source-the-best-advice-for-making-your-first-contribution/).

[Also there is a blog post about "45 Github Issues Dos and Don’ts"](https://davidwalsh.name/45-github-issues-dos-donts).

Linting is done with [ESLint](http://eslint.org) and can be executed with `npm run lint`.
There should be no errors appearing after any JavaScript file changes.

## Installation

```sh
npm install
npm run build
```

## Testing

Unit tests for the build process are using Jest and executed with:

```sh
npm test
```

Web performance tests are done with [Sitespeed.io](https://www.sitespeed.io/):

```sh
npm install -g sitespeed.io
npm start # In a different terminal window
sitespeed.io http://localhost:8080/en
```

## Development history

Versions before 0.4.0 were using PHP as the backend and content editing was done at the site, after
OpenID based login. Content was stored as HTML5 in MySQL database.

From version 0.4.0 onward, the site is running with Node.js and thus JavaScript as the backend.
Content is at the source code repository in text files in Markdown format.

PHP version was made to match the same simplified functionality as the Node.js counterpart in 0.4.1.

Around the release of 0.6.0, the actual `naginata.fi` domain was moved to Heroku and served from there with Node.js.

In late April 2019, deployment of the site was moved to happen in Netlify, instead of Heroku, which also meant that the site is now build as a static web site.

In May 2023, the custom build process, which was some 10 years ago converted from PHP to Node.js, was now migrated to use Eleventy.js which reduced its complexity and increased maintainability.
