App = Ember.Application.create();
App.Store = DS.Store.extend();

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



App.Autocomplete = Ember.ContainerView.extend({
  content: null,
  value: null,
  valuePath: '',
  selected: null,
 
  isDropdownVisible: false,
 
  template: Ember.Handlebars.compile('{{view.content}}'),
  classNames: 'autocomplete',
  childViews: ['inputView', 'dropdownView'],
  emptyView: null,
 
  inputView: Ember.TextField.extend({
    value: function(key, value) {
      var parentView = this.get('parentView'),
          valuePath;
 
      if (arguments.length === 2) {
        return value;
      } else {
        valuePath = parentView.get('valuePath').replace(/^content\.?/, '');
        if (valuePath) { valuePath = '.' + valuePath; }
 
        return parentView.get('value' + valuePath);
      }
    }.property('parentView.value', 'parentView.valuePath'),
 
    keyUp: function(e) {
      var parentView = this.get('parentView');
 
      // Only trigger search when it's not a special key. Having this
      // triggered when value changes gives us false positives as to
      // the user's true intensions.
      if (!parentView.constructor.KEY_EVENTS[e.keyCode]) {
        parentView.trigger('search', this.get('value'));
      }
    }
  }),
 
  dropdownView: Ember.CollectionView.extend({
    classNames: 'dropdown',
    tagName: 'ul',
 
    contentBinding: 'parentView.content',
    selectedBinding: 'parentView.selected',
    templateBinding: 'parentView.template',
    isVisibleBinding: 'parentView.isDropdownVisible',
    emptyViewBinding: 'parentView.emptyView',
 
    itemViewClass: Ember.View.extend({
      tagName: 'li',
      templateBinding: 'parentView.template',
      classNameBindings: ['selected'],
 
      selected: function() {
        var content = this.get('content'),
            value = this.get('parentView.selected');
 
        return content === value;
      }.property('parentView.selected'),
 
      click: function() {
        var parentView = this.get('parentView.parentView'),
            content = this.get('content');
 
        if (parentView) {
          parentView.trigger('select', content);
        }
      }
    })
  }),
 
  keyDown: function(e) {
    var map = this.constructor.KEY_EVENTS,
        method = map[e.keyCode];
 
    if (method && Ember.typeOf(this[method]) === 'function') {
      e.preventDefault();
      this[method](e);
    }
  },
 
  focusIn: function() {
    this.show();
  },
 
  focusOut: function() {
    setTimeout(Ember.$.proxy(this, 'hide'), 200);
  },
 
  select: function(value) {
    this.set('value', value).hide();
  },
 
  search: function(term) {
    var controller = this.get('controller');
 
    if (term) {
      controller.send('search', term, this);
    }
  },
 
  confirm: function() {
    var selected = this.get('selected');
    this.select(selected);
  },
 
  clear: function() {
    this.setProperties({
      value: null,
      selected: null
    }).hide();
  },
 
  next: function() {
    return this._move(+1, this.get('content.firstObject'));
  },
 
  prev: function() {
    return this._move(-1, this.get('content.lastObject'));
  },
 
  show: function() {
    this.set('isDropdownVisible', true);
    return this;
  },
 
  hide: function() {
    this.set('isDropdownVisible', false);
    return this;
  },
 
  _move: function(dir, def) {
    var selected = this.get('selected'),
        content = this.get('content'),
        index = content.indexOf(selected);
 
    if (index !== -1) {
      selected = content.objectAt(index + dir);
    } else {
      selected = def;
    }
 
    this.set('selected', selected).show();
 
    return selected;
  },
 
  contentDidChange: function() {
    this.show();
  }.observes('content')
});
 
App.Autocomplete.KEY_EVENTS = {
  38: 'prev',
  40: 'next',
  27: 'clear',
  13: 'confirm'
};


/**************************
* Controller
**************************/

AutocompleteController = Ember.Controller.extend({
  search: function(term, context) {
    var results = [
      Ember.Object.create({name: 'Bison'}),
      Ember.Object.create({name: 'Vega'}),
    ];
    context.set('content', results);
  }
});

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
