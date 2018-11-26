var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    title: String,
    user: String,
});

var Item = mongoose.model('Item', itemSchema);

function items(req, res) {
    Item.find(function (err, items) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        // return all items as json
        res.json(items);
    });
}

function find(req, res) {
    var id = req.swagger.params.id.value;

    Item.findOne({
        _id: id
    }, function (err, item) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        // return item as json
        res.json(item);
    });
}

function save(req, res) {
    var item = new Item({
        title: req.body.title,
        user: req.body.user
    });

    item.save(function (err, item) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved item with title ' + item.title);
            res.json({
                success: 1,
                description: 'Item saved',
            });
        }
    });
}

function update(req, res) {
    var id = req.swagger.params.id.value;

    Item.findOne({
        _id: id
    }, function (err, item) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.status(204).send(err);
        }

        // update item
        if (req.body.title !== null && req.body.title !== '') {
            item.set({title: req.body.title});
        }

        if (req.body.user !== null && req.body.user !== '') {
            item.set({user: req.body.user});
        }

        item.save(function (err, item) {
            if (err) {
                console.log(err);
            } else {
                console.log('saved item with title ' + item.title);
            }
        });

        // return item as json
        res.json({
            success: 1,
            description: 'Item updated',
        });
    });
}

function remove(req, res) {
    var id = req.swagger.params.id.value;

    Item.remove({_id: id}, function (err) {
        if (err) res.status(204).send(err);
        else res.json({
            success: 1,
            description: 'Item devared',
        });
    });
}

module.exports = {
    items,
    find,
    save,
    update,
    remove
};
