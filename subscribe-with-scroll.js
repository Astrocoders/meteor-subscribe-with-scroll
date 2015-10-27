/* globals SubscribeWithScroll, InfiniteScroll, jQuery */

SubscribeWithScroll = class {
  /**
   * Initializes the SubscribeWithScroll
   * @param  {Object} options
   * @return {SubscribeWithScroll}
   */
  constructor(options){
    check(options, {
    	pub: String,
    	limit: Match.Integer,
    	increment: Match.Integer,
    	template: Match.Optional(Blaze.TemplateInstance),
    	threshold: Match.OneOf(String, jQuery),
    	params: Match.Optional(Function),
    	collection: Mongo.Collection
    });

    this.pub = options.pub;
    this.collection = options.collection;
    this.limit = new ReactiveVar(options.limit);
    this.hasEnded = new ReactiveVar(false);
    this.increment = options.increment;
    this.template = options.template || Meteor;
    this.params = options.params || function(){};
    this.infiniteScroll =
      new InfiniteScroll(options.threshold, options.template);
    this.events = $({});

    return this;
  }

  destroy(){
    this.infiniteScroll.destroy();
    if(this.computation){
      this.computation.stop();
    }
  }

  onEnd(fn){
    return this.events.on('end', fn);
  }

  run(){
    this.computation = Tracker.autorun(() => {
      let params = _.extend(this.params() || {}, {
        limit: this.limit.get()
      });

      let countBefore = this.collection.find().count();
      this.template.subscribe(this.pub, params, () => {
        let count = this.collection.find().count();
        if(countBefore === count){
          this.events.trigger('end');
          this.hasEnded.set(true);
        }
      });
    });

    this.infiniteScroll.onInfinite(() => {
      this.limit.set( this.limit.get() + this.increment );
    });

    this.infiniteScroll.run();
  }
};
