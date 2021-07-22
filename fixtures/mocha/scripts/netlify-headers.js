'use strict';

const AssetGraph = require('assetgraph');

const headers = ['Content-Security-Policy'];

const resourceHintTypeMap = {
  HtmlPreloadLink: 'preload',
  HtmlPrefetchLink: 'prefetch',
  HtmlPreconnectLink: 'preconnect',
  HtmlDnsPrefetchLink: 'dns-prefetch',
};

function getHeaderForRelation(rel) {
  let header = `Link: <${rel.href}>; rel=${resourceHintTypeMap[rel.type]}; as=${
    rel.as
  }; type=${rel.to.contentType}`;

  if (rel.as === 'font') {
    header = `${header}; crossorigin=anonymous`;
  }

  return header;
}

console.error('Generating optimal netlify headers...');

new AssetGraph({ root: 'docs/_dist' })
  .loadAssets('*.html')
  .populate({
    followRelations: { type: 'HtmlAnchor', crossorigin: false },
  })
  .queue((assetGraph) => {
    const assets = assetGraph.findAssets({
      type: 'Html',
      isInline: false,
      isLoaded: true,
    });

    const headerMap = {};

    for (const asset of assets) {
      const url = `/${asset.url
        .replace(assetGraph.root, '')
        .replace(/#.*/, '')
        .replace('index.html', '')}`;
      if (!headerMap[url]) {
        headerMap[url] = [];
      }

      for (const header of headers) {
        const node = asset.parseTree.querySelector(
          `meta[http-equiv=${header}]`
        );

        if (node) {
          headerMap[url].push(`${header}: ${node.getAttribute('content')}`);

          node.remove();
          asset.markDirty();
        }
      }

      const firstCssRel = asset.outgoingRelations.find(
        (r) =>
          r.type === 'HtmlStyle' &&
          r.crossorigin === false &&
          r.href !== undefined
      );

      if (firstCssRel) {
        const header = `Link: <${firstCssRel.href}>; rel=preload; as=style`;

        headerMap[url].push(header);
      }

      const resourceHintRelations = asset.outgoingRelations.filter((r) =>
        ['HtmlPreloadLink', 'HtmlPrefetchLink'].includes(r.type)
      );

      for (const rel of resourceHintRelations) {
        headerMap[url].push(getHeaderForRelation(rel));

        rel.detach();
      }

      const preconnectRelations = asset.outgoingRelations.filter((r) =>
        ['HtmlPreconnectLink'].includes(r.type)
      );

      for (const rel of preconnectRelations) {
        const header = `Link: <${rel.href}>; rel=preconnect`;

        headerMap[url].push(header);

        rel.detach();
      }
    }

    console.log('\n## Autogenerated headers:\n');

    for (const url of Object.keys(headerMap)) {
      console.log(url);

      const httpHeaders = headerMap[url];

      for (const header of httpHeaders) {
        console.log(`  ${header}`);
      }

      console.log('');

      console.error('netlify headers done!');
    }
  })
  .run();
