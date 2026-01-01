# Publishing to npm

## Build

```bash
npm run build:lib
```

## Publish

```bash
cd dist/ngx-data-mapper
npm publish --access public --auth-type=web
```

Browser will open for security key authentication.

## Verify

```bash
npm view @expeed/ngx-data-mapper
```
