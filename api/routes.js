const routes = [
  { name: '/icons8/', fn: require('./icons8'), method: 'get' },
  { name: '/noun/', fn: require('./noun'), method: 'get' },
  { name: '/flatIcon/', fn: require('./flatIcon'), method: 'get' },
  { name: '/synonyms/', fn: require('./synonyms'), method: 'get' },
  { name: '/shutterstock/', fn: require('./shutterstock'), method: 'get' },
  { name: '/iconFinder/', fn: require('./iconFinder'), method: 'get' },
  { name: '/pixabay/', fn: require('./pixabay'), method: 'get' },
  { name: '/unsplash/', fn: require('./unsplash'), method: 'get' },
  { name: '/google/', fn: require('./google'), method: 'get' },
  { name: '/photoroom/', fn: require('./photoroom'), method: 'get' },
  { name: '/removebg/', fn: require('./removebg'), method: 'post' },
  { name: '/slazzer/', fn: require('./slazzer'), method: 'get' },
  { name: '/cloudinary/', fn: require('./cloudinary'), method: 'post' }
]
module.exports = routes