'use strict';
const server = require('server');

server.get('File', function(req, res, next) {
    const Template = require('dw/util/Template')
    const HashMap = require('dw/util/HashMap');
    const pdict = new HashMap();
    pdict.put('path', req.querystring.path);
    response.setContentType(req.querystring['content-type'] || req.querystring.contentType);
    const template = new Template('static');
    response.writer.print(template.render(pdict).text);
});

module.exports = server.exports();
