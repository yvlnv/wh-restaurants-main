  
const {Restaurant, sequelize, Menu} = require('./models')

beforeAll(async () => {
    await sequelize.sync()
})

describe('Restaurants', () => {
    test('when a restaurant is created it is added to the db', async () => {
        const restaurant = await Restaurant.create({name: 'Zima', image: 'image.url'})
        expect(restaurant.id).toBeTruthy()
        expect(restaurant.createdAt).toBeTruthy()
    })
    test('can add menu to a restaurant', async() => {
        const restaurant = await Restaurant.create({name: 'Nenno', image: "url"})
        const menu = await Menu.create({title: 'Mains', image: 'image'}) 
        await restaurant.addMenu(menu)
        const menus = await restaurant.getMenus()
        expect(menus.length).toBe(1)
    })
    test('menu belongs to a restaurant', async() => {
        const restaurant = await Restaurant.create({name: 'Flat Iron', image: "url"})
        const menu = await Menu.create({title: 'Burgers', image: 'image'}) 
        await restaurant.addMenu(menu)
        const menus = await restaurant.getMenus()
        expect(menus[0].restaurantId).toBe(restaurant.id)
    })
})