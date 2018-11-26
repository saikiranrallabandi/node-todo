var endpoint = "/api/items";

function ItemModel(data) {
    var self = this;
    self._id = ko.observable("");
    self.title = ko.observable("");
    self.user = ko.observable("");

    if (!!data) {
        self._id(data._id);
        self.title(data.title);
        self.user(data.user);
    }
}

function IndexModel() {
    var self = this;

    self.binded = false;
    self.items = ko.observableArray([]);
    self.currentItem = ko.observable(new ItemModel());

    // Clear list
    self.clearList = function () {
        self.items.removeAll();
    };

    // Load items
    self.refreshList = function (endpointParam = "") {

        self.clearList();

        var xreq = new XMLHttpRequest();
        xreq.addEventListener("load", function (data) {
            var itemArray = JSON.parse(data.target.responseText);
            console.log("Pulled " + itemArray.length + " items");
            self.clearList();


            // Add each item to local array
            JSON.parse(data.target.responseText).forEach(function (element) {
                self.items.push(new ItemModel(element));
            }, this);

            console.log("Loaded " + self.items().length + " items into the view");

            if (!self.binded) {
                ko.applyBindings(self);
                self.binded = true;
            }
        });
        xreq.open("GET", endpoint + endpointParam);
        xreq.setRequestHeader("Content-type", "application/json");
        xreq.send();
    };

    self.refreshList();

    self.addItem = function () {
        console.log("Create new item with values: " + ko.toJSON(self.currentItem));

        var xreq = new XMLHttpRequest();
        xreq.addEventListener("load", function (data) {
            self.refreshList();
        });
        xreq.open("POST", endpoint);
        xreq.setRequestHeader("Content-type", "application/json");
        xreq.send(ko.toJSON(self.currentItem));
    };

    self.removeItem = function (item) {
        console.log("Delete item with id " + item._id());
        var xreq = new XMLHttpRequest();

        xreq.addEventListener("load", function (data) {
            self.items.destroy(item);
        });
        xreq.open("DELETE", endpoint + "/" + item._id());
        xreq.setRequestHeader("Content-type", "application/json");
        xreq.send(ko.toJSON({_id:item._id()}));
    };



    self.removeAll = function () {
        console.log("Delete all items");
        self.items().forEach(function (item) {
            self.items.destroy(item);
        });
        self.refreshList();
    };
}

var localModel = new IndexModel();
