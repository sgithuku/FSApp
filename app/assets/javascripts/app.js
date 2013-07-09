App = Ember.Application.create();

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

// Search function

// App.SearchTextField = Em.TextField.extend({
//     insertNewline: function() {
//         App.Tweets();
//     }
// });



App.Tweet=Em.Object.extend();

/**************************
* View
**************************/

App.SearchTextField=Em.TextField.extend();
var search=App.SearchTextField.create({
    insertNewline:function(){
        App.SearchResultsController();
    },

    remove:function(){
        this.remove();
    }

});

App.TweetCountView=Ember.View.extend({
    count:null
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

    authenticate: function(){

        if (content.length > 0){
            content.clear() && this.removeString(query)
        }
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
                                            self.addTweet(App.Tweet.create(
                                                reply.statuses[i]));
                                        }
            },
            true
        );

        /* Youtube video embed */

        var urlY = "http://www.youtube.com/embed?listType=search&&vq=hd720&list="+query;
        var ifr = document.getElementById('video') ;
        ifr.src = urlY ;
        return false ;
      }
});


/**************************
* Index Routes
**************************/

Ember.Handlebars.registerBoundHelper('linkify', function (text) {
    text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
        return '<a target ="_blank" href="' + s + '">' + s + '</a>';
    });
 
    text = text.replace(/(^|)@(\w+)/gi, function (s) {
        return '<a target="_blank" href="http://twitter.com/' + s + '">' + s + '</a>';
    });
    return new Handlebars.SafeString(text);
});


Handlebars.registerHelper('link', function(text, url, style, source) {
  text = Handlebars.Utils.escapeExpression(text);
  url  = Handlebars.Utils.escapeExpression(url);
  style = Handlebars.Utils.escapeExpression(style);
  source = Handlebars.Utils.escapeExpression(App.searchResultsController.query);

  var result = '<a class="'+ style +'" href="' + url + source +'">' + text + source +'</a>';

  return result;
});
