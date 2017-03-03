Package.describe({
  name: 'astrocoders:subscribe-with-scroll',
  version: '0.0.3',
  summary: 'Infinite Scroll with Meteor subscription system',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use([
    'ecmascript',
    'check',
    'astrocoders:infinite-scroll@0.0.2',
    'underscore',
    'reactive-var',
    'tracker'
  ]);

  api.addFiles('subscribe-with-scroll.js', 'client');
  api.export('SubscribeWithScroll', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('astrocoders:subscribe-with-scroll');
  api.addFiles('subscribe-with-scroll-tests.js');
});
