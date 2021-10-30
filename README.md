# Icon Lib Builder (client)

Small tool to generate a framework component (React, Preact, Angular or Vue) from a SVG icons. Copy and paste the SVG icon content to the tool and you will have a basic framework template to use the svg icon in your project.

Also, drop some SVG icon files to the tool, and you could download the icons in the framework file as you want.

## How to run

- `npm run install` or `yarn install`
- Define .env vars (copy and paste the .env.example file)
  ```
  NEXT_PUBLIC_API_URL=http://localhost:PORT
  ```
- `npm run dev` or `yarn dev`

By default, you will have http://localhost:3000, if you want to change the port, run `--port XXXX` after `dev` command

## Scripts

| Npm Script   | Description                                               |
| ------------ | --------------------------------------------------------- |
| `dev`        | run project to develop in local watching any change       |
| `build`      | build project run as `NODE_ENV=production yarn build`     |
| `start`      | once the project is built, serve the distribution content |
| `test`       | run tests one time                                        |
| `test:watch` | run tests and linten for changes                          |
| `lint`       | lint code                                                 |

## Author

```js
{
	name: "Dimas López",
	role: "FullStack Software development",
	alias: "dimaslz",
	twitter: "https://twitter.com/dimaslz",
	site: "https://dimaslz.dev",
	linkedin: "https://www.linkedin.com/in/dimaslopezzurita"
}
```
