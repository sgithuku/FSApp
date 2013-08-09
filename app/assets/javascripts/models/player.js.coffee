# for more details see: http://emberjs.com/guides/models/defining-models/

FSApp.Player = DS.Model.extend
  name: DS.attr 'string'
  text: DS.attr 'string'
  birthplace: DS.attr 'string'
  age: DS.attr 'number'
  position: DS.attr 'string'
  image: DS.attr 'string'
