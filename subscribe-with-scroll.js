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
   *  	params: Function
   *  }
   * @return {SubscribeWithScroll}
   */
  constructor(options){
    this.pub = options.pub;
    this.limit = new ReactiveVar(options.limit);
    this.increment = options.increment;
    this.subscribe = options.template && options.template.subscribe ||
                    Meteor.subscribe;
    this.params = options.params || function(){};
    this.infiniteScroll =
      new InfiniteScroll(options.threshold, options.template);

    return this;
  }

  destroy(){
    this.infiniteScroll.destroy();
    if(this.computation){
      this.computation.stop();
    }
  }

  run(){
    this.computation = Tracker.autorun(() => {
      let params = _.extend(this.params(), {
        limit: this.limit.get()
      });
      this.subscribe(this.pub, params);
    });

    this.infiniteScroll.onInfinite(() => {
      this.limit.set( this.limit.get() + this.increment );
    });
  }
};
