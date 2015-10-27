/* globals SubscribeWithScroll, InfiniteScroll */

SubscribeWithScroll = class {
  /**
   * Initializes the SubscribeWithScroll
   * @param  {Object} options
   *  {
   *  	pub: String,
   *  	limit: Number,
   *  	increment: Number,
   *  	template: Blaze.TemplateInstance,
   *  	threshold: String,
   *  	params: Function,
   *  	collection: Mongo.Collection
   *  }
   * @return {SubscribeWithScroll}
   */
  constructor(options){
    this.pub = options.pub;
    this.collection = options.collection;
    this.limit = new ReactiveVar(options.limit);
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
      let params = _.extend(this.params(), {
        limit: this.limit.get()
      });

      let countBefore = this.collection.find().count();
      this.template.subscribe(this.pub, params, () => {
        let count = this.collection.find().count();
        if(countBefore === count){
          this.events.trigger('end');
        }
      });
    });

    this.infiniteScroll.onInfinite(() => {
      this.limit.set( this.limit.get() + this.increment );
    });

    this.infiniteScroll.run();
  }
};
