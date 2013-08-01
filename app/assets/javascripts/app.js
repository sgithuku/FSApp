App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    selectedVideo: null,
    LOG_ACTIVE_GENERATION: true,
    LOG_VIEW_LOOKUPS: true
});

Ember.LOG_BINDINGS = true;

/**************************
* Routes
**************************/

App.Router.map(function(){
    this.route('searchResults')
});

App.IndexRoute = Em.Route.extend({
    model: function(){return this.modelFor('application');}
});

Ember.Route.reopen({
  enter: function(router) {
    this._super(router);
    if(this.get('isLeafRoute')) {
      var path = this.absoluteRoute(router);
      mixpanel.track('page viewed', {'page name' : document.title, 'url' : path});
      _gaq.push(['_trackPageview', path]);
    }
  }
});

App.searchResultsRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('content', '');
    this._super.apply(this, arguments);

  },
  redirect: function() {
    this.transitionTo('index');
  },


});

/**************************
* Models
**************************/


App.Store = DS.Store.extend({
    adapter: 'DS.RESTAdapter'
});


App.Player = DS.Model.extend({
    name: DS.attr('string'),
    text: DS.attr('string'),
    birthplace: DS.attr('string'),
    age: DS.attr('number'),
    position: DS.attr('string'),
    image: DS.attr('string'),
});

App.Teams = [
        Ember.Object.create({id:1, team:'arsenal',realteam:'Arsenal'}),
        Ember.Object.create({id:2, team:'aston_villa',realteam:'Aston Villa'}),
        Ember.Object.create({id:3, team:'cardiff',realteam:'Cardiff'}),
        Ember.Object.create({id:4, team:'chelsea',realteam:'Chelsea'}),
        Ember.Object.create({id:5, team:'crystal_palace',realteam:'Crystal Palace'}),
        Ember.Object.create({id:6, team:'everton',realteam:'Everton'}),
        Ember.Object.create({id:7, team:'fulham',realteam:'Fulham'}),
        Ember.Object.create({id:8, team:'hull_city',realteam:'Hull City'}),
        Ember.Object.create({id:9, team:'liverpool',realteam:'Liverpool'}),
        Ember.Object.create({id:10, team:'manchester_city',realteam:'Manchester City'}),
        Ember.Object.create({id:11, team:'manchester_united',realteam:'Manchester United'}),
        Ember.Object.create({id:12, team:'newcastle_united',realteam:'Newcastle'}),
        Ember.Object.create({id:13, team:'norwich_city',realteam:'Norwich City'}),
        Ember.Object.create({id:14, team:'southampton',realteam:'Southampton'}),
        Ember.Object.create({id:15, team:'stoke_city',realteam:'Stoke City'}),
        Ember.Object.create({id:16, team:'sunderland',realteam:'Sunderland'}),
        Ember.Object.create({id:17, team:'swansea_city',realteam:'Swansea City'}),
        Ember.Object.create({id:18, team:'tottenham_hotspur',realteam:'Tottenham Hotspur'}),
        Ember.Object.create({id:19, team:'west_ham_united',realteam:'West Ham United'}),
        Ember.Object.create({id:20, team:'west_bromwich_albion',realteam:'West Bromwich Albion'}),
            ];

App.Tweet=Em.Object.extend();



/**************************
* Views
**************************/



App.SearchTextField=Em.TextField.extend({
    insertNewline: function() {
            var value = this.get('value');
            if (value) {
                var query = this.get('value');
                    App.searchResultsController.play(query);
            }
        }
});


App.TweetCountView=Ember.View.extend({
    count:null
});

App.searchResultsView = Em.View.extend({
    didInsertElement: function(){
       //called on creation
      },
      willDestroyElement: function(){
       //called on destruction
       this.$().slideDown(250);
      }
});

// App.searchResultsView = Ember.View.reopen({
//     $: function(){
//         if(window.billy){debugger;}
//         return this._super.apply(this,arguments);
//     }
// });




/**************************
* Controller
**************************/
App.searchResultsController=Em.ArrayController.createWithMixins({
    content:[],
    _idCache: {},
    tweet_count:'',
    query: '',
    parameter:null,
    Loading: false,

    addTweet: function(tweet) {
    // The `id` from Twitter's JSON
        var id = tweet.get("id");
        this.parameter++;
    // If we don't already have an object with this id, add it.
        if (typeof this._idCache[id] === "undefined") {
            this.pushObject(tweet);
            this._idCache[id] = tweet.id;
        }
    },

    reverse:function(){
        return this.toArray().reverse();
    }.property('@each'),

    play: function(){
        var self=this;
        var Loading = this.get('Loading');
        this.set('Loading',true);

        var content = this.get('content');
        if (content.length > 0){
            content.clear();
        }
        App.Router.router.transitionTo('index');

        /* twitter search */
        var cb = new Codebird;
        var query=self.get("query");
        cb.setConsumerKey('bJZupffcmbMpeC0GhromA','QbE611TJ1IbmVQ0rsVJcS2ars5PonaYfnyDsc6NcQbo');

        cb.__call(
            'search_tweets',
            'q='+query+" "+App.Teams.selectedTeam.realteam+"&count=15&include_entities=false&result_type=popular&lang=en",
            function(reply){
                
                for (var i = 0; i < reply.statuses.length; i++) 
                                        {
                                            self.addTweet(App.Tweet.create(reply.statuses[i]));
                                        }
            },
            true
        );


        

        App.Router.router.transitionTo('searchResults');
        var complete = function(){self.set('Loading',false);};
        complete();

      }
});




/**************************
* Handlebar
**************************/
Ember.Handlebars.registerBoundHelper('youtube',function(query){
    urlY = "http://www.youtube.com/embed?listType=search&&vq=hd720&list="+query;
    var result = '<iframe id="video" width="640" height="360" border="0" frameBorder="0" src="'+ urlY +'"></iframe>';
    return new Handlebars.SafeString(result);
});


Ember.Handlebars.registerBoundHelper('linkify', function (text) {
    text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
        return '<a target ="_blank" href="' + s + '">' + s + '</a>';
    });
 
    text = text.replace(/(^|)@(\w+)/gi, function (s) {
        return '<a target="_blank" href="http://twitter.com/' + s + '">' + s + '</a>';
    });
    // text = text.replace(/(^|)#(\w+)/gi, function (s) {
    //         return '<a href="http://search.twitter.com/search?q=' + s.replace(/#/,'%23') + '">' + s + '</a>';
    //      });
    return new Handlebars.SafeString(text);
});


Handlebars.registerHelper('link', function(text, url, style, source) {
  text = Handlebars.Utils.escapeExpression(text);
  url  = Handlebars.Utils.escapeExpression(url);
  style = Handlebars.Utils.escapeExpression(style);
  source = Handlebars.Utils.escapeExpression(App.searchResultsController.query);

  var result = '<a class="'+ style +'" href="' + url + source +'">' + text + '<span class="upper">'+ source + '</span>' +'</a>';

  return result;
});

Ember.Handlebars.registerBoundHelper('twitter_user', function (text) {
    text = text.replace(/.*/g, function (s) {
        return '<a target="_blank" href="http://twitter.com/' + s + '">'+ s + '</a>';
    });
    return new Handlebars.SafeString(text);
});


Ember.Handlebars.registerBoundHelper('dateFormat', function(text) {
    return moment(text).twitterLong();
});

/**************************
* Fixing page structure
**************************/

$(document).ready(function () {
        var column_height = $("body").height();
        $(".header").css("height",column_height);
        var row_width = $("body").width();
        $("ul.tile").css("width",row_width);
});
