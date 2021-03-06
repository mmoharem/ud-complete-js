//Notes:
// document.addEventListner('keypress', function(event) {
//     console.log(event);
// });

/////////////////////// budgetController....
var budgetController = (function(UICrtl) {

    var Expense = function(id, descr, value) {
        this.id = id;
        this.descr = descr;
        this.value = value;
        this.percentage = -1;
    };

    var Income = function(id, descr, value) {
        this.id = id;
        this.descr = descr;
        this.value = value;
    };

    Expense.prototype.calcPercent = function() {
        var percentage
        inc = allData.total.inc;

        if (inc !== 0) {

            this.percentage = math.round(exp / allData.total.inc * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercent = function() {
        return this.percentage;
    }

    var calcTotal = function(type) {
        var itemsArr = allData.items[type];
        // var totalArr = allData.total[type];
        var sum = 0;
        allData.items[type].forEach(function(cur) {

            sum += cur.value;
            allData.total[type] = sum;

        });
    }

    var allData = {
        items: {
            exp: [], //[1,2,3,4]
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };


    return {
        addItems: function(type, des, val) {
            id = 0;
            var newItem, ID,

                //select (inc or exp) array.
                itemsArr = allData.items[type];

            if (itemsArr.length > 0) {
                //Create new ID.
                ID = itemsArr[itemsArr.length - 1].id + 1;
            } else {
                ID = -1;
            }


            //Creat new item (exp or inc)
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            } else
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push item into data structure
            allData.items[type].push(newItem);

            return newItem;
        },

        calcBudget: function() {
            var totalExp, totalInc;
            //calculate total inc and exp.
            calcTotal('exp');
            calcTotal('inc');
            //calculate budget inc-exp.
            // allData.budget = totalInc - totalExp;
            allData.budget = allData.total.inc - allData.total.exp;
            //calculate the percentage of inc we spend.
            if (allData.total.inc > 0) {
                allData.percentage = Math.round((allData.total.exp / allData.total.inc) * 100);
            } else {
                allData.percentage = -1;
            }


        },

        calcExpPercent: function(obj) {

            allData.items.exp.forEach(function(current) {
                current.calcPercent();
            });
            // calcPercent(obj.);
        },

        getBudget: function() {
            return {
                totalExp: allData.total.exp,
                totalInc: allData.total.inc,
                budget: allData.budget,
                percentage: allData.percentage
            }
        },
        // id=6
        // exp=[1,2,4,6,8]
        // allData.items[type][id]
        // index=3
        deleteItem: function(type, id) {
            var ids, index,
                itemArr = allData.items[type];

            ids = itemArr.map(function(current) {
                // console.log(current.id);
                return current.id;
            });

            // console.log('current.id: ' + ids); //[0 1 2]
            // console.log('id is: ' + id); //0 or 1 or 2
            index = ids.indexOf(id); //if the item is not exist then it return -1
            // console.log(index);

            if (index !== -1) {
                itemArr.splice(index, 1);
            }
        },

        testingData: function() {
            console.log(allData);

        }
    };
})(UIController);


//////////////////// UIController...................
var UIController = (function() {
    // var el = document.querySelector;
    var domStrings = {

        // 1. Input. 
        inputType: '.add__type',
        inputDescr: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        // 2. Output list.
        incContainer: '.income__list',
        expContainer: '.expenses__list',
        // 3. Output Budget.
        budgetVal: '.budget__value',
        incVal: '.budget__income--value',
        expVal: '.budget__expenses--value',
        expPercentage: '.budget__expenses--percentage',
        //
        container: '.container'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescr).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value),
            };

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // 1- Create HTML string with placeholder text
            if (type === 'inc') {
                element = domStrings.incContainer;
                html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class = "right clearfix"> <div class = "item__value"> %value% </div> <div class = "item__delete"> <button class = "item__delete--btn"> <i class = "ion-ios-close-outline"> </i> </button></div> </div></div> ';
            } else

            if (type === 'exp') {
                element = domStrings.expContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class = "right clearfix"> <div class = "item__value"> %value% </div> <div class = "item__percentage"> 21 % </div><div class="item__delete"> <button class = "item__delete--btn"> <i class = "ion-ios-close-outline"> </i> </button></div > </div></div>';
            }


            // 2- Replace the placeholdr text with some actual data
            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.descr).replace('%value%', obj.value);
            // newHtml = newHtml.replace('%description%', obj.descr);
            // newHtml = newHtml.replace('%value%', obj.value);
            // 3- Insert the adjacentHTML element into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        removeListItem: function(itmId) {
            var el = document.getElementById(itmId);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(domStrings.inputDescr + ', ' + domStrings.inputValue);
            //Change fiels to array
            fieldsArr = Array.prototype.slice.call(fields);
            //using foreach(callback fn)
            fieldsArr.forEach(function(current, index, array) {

                current.value = "";
            });

            fieldsArr[0].focus();

        },

        displayBudget: function(obj) {
            //output budget
            document.querySelector(domStrings.budgetVal).textContent = obj.budget;
            //otput total income
            document.querySelector(domStrings.incVal).innerHTML = obj.totalInc;
            //output total expanses
            document.querySelector(domStrings.expVal).innerHTML = obj.totalExp;
            // output percentage
            if (obj.percentage > 0) {
                document.querySelector(domStrings.expPercentage).innerHTML = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.expPercentage).innerHTML = '0%';
            }
        },



        getDomStrings: function() {
            return domStrings
        }


    };

})();

var controller = (function(budgetCtrl, UICrl) {

    var setEventListner = function() {
        var domStr = UICrl.getDomStrings();

        document.querySelector(domStr.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) { // e stand for event
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(domStr.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calcBudget();
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        // console.log(budget);
        // 6. Display the budget on the UI
        UICrl.displayBudget(budget)
    };

    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the field input
        input = UICrl.getInput();
        // console.log
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItems(input.type, input.description, input.value);
            // 3. add the item to UI-controller
            UICrl.addListItem(newItem, input.type);

            budgetCtrl.calcExpPercent(newItem);
            // 4. Calculate and update budget
            updateBudget();


        }
        // 4. Clear Fielsd
        UICrl.clearFields();
        // 5. calculate the budget
        // 6. Display the budget on the UI
        // 7. Calculate and update budget
    };

    var addExpPercent = function(newItem) {
        budgetCtrl.calcExpPercent(newItem);
    };

    var ctrlDeleteItem = function(event) {
        var itemID, ID, type, input;
        input = UICrl.getInput();
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //1. Delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delete the item from UI
            UICrl.removeListItem(itemID);
            //3. Update and show the new buget UI
            updateBudget();
        };

    };

    return {
        init: function() {
            console.log('Application has started.');
            UICrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '0%'
            });
            setEventListner();
        }
    }

})(budgetController, UIController);

controller.init();