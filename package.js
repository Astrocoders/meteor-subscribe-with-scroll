Package.describe({
  name: 'astrocoders:subscribe-with-scroll',
  version: '0.0.2',
  summary: 'Infinite Scroll with Meteor subscription system',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use([
    'ecmascript',
    'astrocoders:publish',
    'astrocoders:infinite-scroll',
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
