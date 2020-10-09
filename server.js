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
    res.render('restaurants', {restaurants, date: new Date()})
})

app.post('/', async (req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/')
})

app.post('/restaurants/:id', (req, res) => {
    res.redirect(`/restaurants/${req.params.id}`)
})

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const menus = await restaurant.getMenus({
        include: ['items']
    })
    res.render('restaurant', {restaurant, menus})
})

app.get('/about', (req, res) => {
    res.render('about', {name: 'Yana Volnova'})
})

app.get('/edit', (req, res) => {
    res.render('edit')
})

app.get('/edit/add', (req, res) => {
    res.render('add_restaurant')
})

app.get('/edit/restaurants/:id/edit_name_image', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('edit_name_image', {restaurant})
})

app.get('/edit/restaurants/:id/edit_menu_name/:menu_id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const menu = await Menu.findByPk(req.params.menu_id)
    res.render('edit_menu_name', {restaurant, menu})
})

app.get('/edit/restaurants/:id/:menu_id/edit_item/:item_id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const menu = await Menu.findByPk(req.params.menu_id)
    const item = await Item.findByPk(req.params.item_id)
    res.render('edit_item', {restaurant, menu, item})
})

app.get('/edit/restaurants/:id/add_item/:menu_id', async (req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('add_item', {menu, restaurant})
})

app.post('/edit/restaurants/:id/edit_menu_name/:menu_id', async (req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    menu.update(req.body)
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.get('/edit/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll({
        include: [{model: Menu, as: "menus"}]
    })
    res.render('choose_edit_restaurant', {restaurants})
})

app.post('/edit/restaurants/:id/edit_name_image', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    restaurant.update(req.body)
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.post('/edit/restaurants/:id/:menu_id/edit_item/:item_id', async (req, res) => {
    const item = await Item.findByPk(req.params.item_id)
    item.update(req.body)
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.post('/edit/restaurants/:id/delete', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    restaurant.destroy()
    res.redirect('/')
})

app.post('/edit/restaurants/:id/delete_menu/:menu_id', async (req, res) => {
    const menu = await Menu.findByPk(req.params.menu_id)
    menu.destroy()
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.post('/edit/restaurants/:id/delete_item/:item_id', async (req, res) => {
    const item = await Item.findByPk(req.params.item_id)
    item.destroy()
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.post('/edit/restaurants/:id/add_menu', async (req, res) => {
    await Menu.create(req.body)
    console.log(req.body)
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.post('/edit/restaurants/:id/add_item/:menu_id', async (req, res) => {
    await Item.create(req.body)
    console.log(req.body)
    res.redirect(`/edit/restaurants/${req.params.id}`)
})

app.get('/edit/restaurants/:id/add_menu', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    res.render('add_menu', {restaurant})
})

app.get('/edit/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const menus = await restaurant.getMenus({
        include: ['items']
    })
    res.render('edit_restaurant', {restaurant, menus})
})

app.listen(3000, async () => {
    await sequelize.sync()
    console.log('Web server is running')
})
