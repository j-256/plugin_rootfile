'use strict';
const server = require('server');

// NOTE: Cache time will be determined by the configured static cache TTL due to the static resource being remote-included; setting it here will do nothing
server.get('File', function(req, res, next) {
    const Template = require('dw/util/Template')
    const HashMap = require('dw/util/HashMap');
    const pdict = new HashMap();
    pdict.put('path', req.querystring.path);
    response.setContentType(req.querystring['content-type']);
    const template = new Template('static');
    response.writer.print(template.render(pdict).text);
});

module.exports = server.exports();
