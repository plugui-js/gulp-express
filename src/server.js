const express = require('express'),
handlebars = require('express-handlebars'),
path = require('path');


const app = express(),
hbs = handlebars({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: path.resolve(__dirname, './views/partials')
});

app.set('views', path.resolve(__dirname, './views'));
app.engine('hbs', hbs)
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home', { message: 'GulpExpress Here!'});
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});