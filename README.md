SubscribeWithScroll
===================

Get more data from a subscription as more the user scrolls.

## Usage

In client
```css
/* To be able to scroll, ensure these styles to your threshold */
  .overflow-scroll {
    overflow-y: scroll;
  }
```

```js
Template.Foo.helpers({
  listHasEnded: function(){
    return Template.instance().SubscribeWithScroll.hasEnded.get();
  }
});

Template.Foo.onRendered(function(){
  this.SubscribeWithScroll = new SubscribeWithScroll({
    pub: 'userItems',
    threshold: '.overflow-scroll',
    increment: 12,
    limit: 9,
    template: this,
    // If any reactive data source in here changes, the subscription will
    // re-run
    params: function(){
      return {
        userId: Meteor.users.findOne()
      }
    }
  });

  this.SubscribeWithScroll.run();
});
```
In server:
```js
  // Syntax here is from astrocoders:publish package
  // Limit is automatically increased as more the user reaches the end of the
  // threshold element.
  Items.publish('userItems').ifSignedIn().mongoRule((params) => {
    return {
      limit: params.limit
    };
  });
```
