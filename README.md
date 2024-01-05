# plugin_rootfile
## An SFCC B2C Cartridge which serves static text files from any cartridge at any URI.

### How?
Uses aliases config to map a site path to a pipeline which serves the file content directly (no redirect).

### Installation
Add to the site's cartridge path and configure aliases per the example provided.

#### Aliases Example
```json
{
    "__version": "1",
    "www.site.com": [
        {
            "if-site-path": "/sw.js",
            "pipeline": "Static-File",
            "params": {
                "path": "/examples/js/service-worker.js",
                "content-type": "text/javascript"
            }
        },
        {
            "if-site-path": "/.well-known/assetlinks.json",
            "pipeline": "Static-File",
            "params": {
                "path": "/examples/json/assetlinks.json",
                "content-type": "application/json"
            }
        }
    ]
}
```

#### Notes
- This approach was generalized from [plugin_serviceworker](https://github.com/SalesforceCommerceCloud/plugin_serviceworker) (not a public repository).
- Alias updates are not necessarily instant.
- If the content for a new setup comes through as just a `<wainclude>` tag, this should resolve in some time or after a restart. Cause currently unknown.
