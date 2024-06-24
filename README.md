# plugin_rootfile
## An SFCC B2C Cartridge which serves static text files from any cartridge at any URI, including the base path.

### Why?
There is no straightforward way to serve a file from the root path or specific URI in B2C Commerce. This is relevant for Service Workers, where path determines scope, as well as `/.well-known` resources.  
Most end up using a workaround which requires placing code in a Content Asset. This leaves the code outside of your code version and therefore outside of your versioning system (i.e. Git). Depending on the use case you can set up a redirect, but some services and verification processes will not follow redirects, requiring the resource be served directly.

### How?
Uses aliases config to map a site path to a pipeline which serves the file content directly (no redirect).

### Installation
Add to the site's cartridge path and configure aliases per the example provided. Cache time is determined by the site's static cache TTL.

#### Aliases Example
```json
{
    "__version": "1",
    "www.site.com": [
        {/* Need at least one entry without if-site-path or the first will be prepended to every URL */},
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
- Alias updates _should_ be essentially instant.
- If the content for a new setup comes through as just a `<wainclude>` tag, this should resolve in some time or after a restart. Cause currently unknown.
