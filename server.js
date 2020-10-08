const express = require('express')
const expressHandlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {Restaurant, Menu, Item, sequelize} = require('./models')

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
    const restaurants = await Restaurant.findAll({
        include: [{model: Menu, as: "menus"}]
    })
    console.log(restaurants)
    res.render('restaurants', {restaurants, date: new Date()})
})

app.post('/', async (req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/')
})

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const menus = await restaurant.getMenus({
        include: ['items']
    })
    res.render('restaurant', {restaurant, menus})
})

app.get('/about', (req, res) => {
    res.render('about', {name: 'Yana'})
})

app.get('/add_restaurant', (req, res) => {
    res.render('add_restaurant')
})

app.listen(3000, async () => {
    await sequelize.sync()
    console.log('Web server is running')
})
