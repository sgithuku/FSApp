App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

Ember.LOG_BINDINGS = true;

/**************************
* Routes
**************************/

App.Router.map(function(){
    this.route('searchResults')
});

App.ApplicationRoute = Em.Route.extend({
    model: function(){
        return App.Player.find();
    }
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
  },
  redirect: function() {
    this.transitionTo('index');
  }

});

/**************************
* Models
**************************/


App.Store = DS.Store.extend({
    adapter: 'DS.FixtureAdapter'
});


App.Player = DS.Model.extend({
    name: DS.attr('string')
});

App.Player.FIXTURES =[
    {id:1,name: 'Theo Walcott',count:null},
    {id:2,name: 'Gervinho',count:null},
    {id:3,name: 'Gonzalo Higuain',count:null},
    {id:4,name: 'Yaya Sanogo',count:null},
    {id:5,name: 'Thiago Alcantara',count:null},
    {id:6,name: 'Cesc Fabregas',count:null},
    {id:7,name: 'Edinson Cavani',count:null},
    {id:8,name: 'Cristiano Ronaldo',count:null}
];



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
                App.searchResultsController.play(value);
                this.set('value', App.searchResultsController.query);
            }
        }
});


App.TweetCountView=Ember.View.extend({
    count:null
});

App.searchResultsView = Em.View.extend({
  templateName: 'searchResults'
});


/**************************
* Controller
**************************/
App.searchResultsController=Em.ArrayController.createWithMixins({
    content:[],
    _idCache: {},
    tweet_count:'',
    query: '',
    parameter:null,

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

    // clean: function(){
    //     return this.toArray().filter
    // }

    play: function(){
        var content = this.get('content');
        if (content.length > 0){
            content.clear();
        }
        App.Router.router.transitionTo('index');

        var cb = new Codebird;
        var self=this;
        var query=self.get("query");
        cb.setConsumerKey('bJZupffcmbMpeC0GhromA','QbE611TJ1IbmVQ0rsVJcS2ars5PonaYfnyDsc6NcQbo');

        cb.__call(
            'search_tweets',
            'q='+query+" "+App.Teams.selectedTeam.realteam+"&count=15&include_entities=true&result_type=popular&lang=en",
            function(reply){
                
                for (var i = 0; i < reply.statuses.length; i++) 
                                        {
                                            self.addTweet(App.Tweet.create(reply.statuses[i]));
                                        }
            },
            true
        );

        /* Youtube video embed */

        // var urlY = "http://www.youtube.com/embed?listType=search&&vq=hd720&list="+query;
        // var ifr = document.getElementById('video') ;
        // ifr.src = urlY ;
        // return false;
        App.Router.router.transitionTo('searchResults');
      }
});

App.PlayerController = Em.ArrayController.extend({
    save: function(){
        this.get("selectedPlayer.name").createRecord({
            save: this.get("store").commit()
        });
    }
})


/**************************
* Handlebar
**************************/

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
        return '<a target="_blank" href="http://twitter.com/' + s + '">' + s + '</a>';
    });
    return new Handlebars.SafeString(text);
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
