
// BUDGET CONTROLLER
var budgetController = ( function() {

    // Data Structures to store an Expense or Income
    var Expense = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome)
    {
        if (totalIncome > 0)
        {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else
        {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function()
    {
        return this.percentage;
    }


    var Income = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type)
    {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;

    };
    // Expenses and values stored within 'data'
    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1
    };

    return {
        // addItem: Using the input values supplied, a new expense is created and added to the data structure
        addItems: function(type, desc, val)
        {
            var newItem, id;

            // Create a new ID
            if (data.allItems[type].length > 0)
            {
                id = (data.allItems[type][data.allItems[type].length - 1].id) + 1;
            }
            else
            {
                id = 0;
            }

            // Create a new item depending on the type, inc or exp
            if (type === 'exp')
            {
                newItem = new Expense(id, desc, val);
            }

            else if (type === 'inc')
            {
                newItem = new Income(id, desc, val);
            }

            // Add element to data structure
            data.allItems[type].push(newItem);

            // Return the new item that is created
            return newItem;
        },

        deleteItem: function(type, id)
        {
            var ids, index;

            // map: performs some operation on an array and returns a new array
            var ids = data.allItems[type].map(function(current)
            {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1)
            {
                data.allItems[type].splice(index, 1);
            }

            else
            {
                console.log('Item not found');
            }
        },

        calculateBudget: function() 
        {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate budget: income subtract expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the % of income that is spent
            if (data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        },

        calculatePercentages: function() 
        {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() 
        {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });

            return allPerc;
        },

        getBudget: function() 
        {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        // testing: displays the data structure
        testing: function()
        {
            console.log(data);
        }

    }
} )();


// UI CONTROLLER
var UIController = ( function() 
{
    /* DOMStrings: Contains all of the element selector strings, keeping them in once place
    allows for any changes to be made without having to make changes in multiple places */
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function(num, type)
    {
        var numSplit, int, dec, type, sign;
        /*
        + / - before number
        Two decimal points
        Comma separating thousands 
        */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        // 1000 -> 1,000
        if (int.length > 3)
        {
            int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    return {
        // getInput: Retrieves the input from the user for their expense
        getInput: function()
        {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                // String -> Float
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) 
        {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc')
            {
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            else if (type === 'exp')
            {
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML from the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID)
        {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function()
        {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            // List -> Array
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            // Set the focus of the fields back to the first one
            fieldsArr[0].focus();
            
        },

        displayBudget: function(obj)
        {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';


            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if (obj.percentage > 0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }


        },

        displayPercentages: function(percentages)
        {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function(list, callback)
            {
                for (var i = 0; i < list.length; i++)
                {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current,index)
            {
                if (percentages[index] > 0)
                {
                    current.textContent = percentages[index] + '%';
                }
                else
                {
                    current.textContent = '---';
                }
                
            });
        },

        displayMonth: function()
        {
            var now, month, year;
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();


            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },


        // getDOMStrings: Returns the DOMStrings to be used elsewhere in the application
        getDOMstrings: function()
        {
            return DOMstrings;
        }
    }
} )();


// GLOBAL APP CONTROLLER
var controller = ( function(budgetCtrl, UICtrl) 
{
    // setupEventListeners: Event Listeners are setup and added in this method
    var setupEventListeners = function() 
    {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });

        // Event Delegation: all incomes and expenses will be assigned the event ctrlDeleteItem
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() 
    {
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        var budget = budgetCtrl.getBudget();

        // Display the budget in the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() 
    {
        // Calculate the percentages
        budgetCtrl.calculatePercentages();

        // Read the percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // Update the UI
        UICtrl.displayPercentages(percentages);
    };

    // ctrlAddItem: The main controller method facilitating the addition of an item to the application
    var ctrlAddItem = function() 
    {
        var input, newItem;
        // Get the values from the input fields
        input = UICtrl.getInput();

        // Sanity check: making sure there is actual data that has been entered before processing
        if (input.description !== null && !isNaN(input.value) && input.value > 0)
        {
            // Add the values to the budget controller
            newItem = budgetCtrl.addItems(input.type, input.description, input.value);

            // Add the value to the UI - display it from the data structure
            UICtrl.addListItem(newItem, input.type);

            // Clear the UI fields once the user has submitted expense
            UICtrl.clearFields();

            // Calculate the budget + display the budget
            updateBudget();

            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) 
    {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID)
        {
            // Return an array of separated string elements
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // Delete item from data structure
            budgetCtrl.deleteItem(type, id);

            // Delete item from user interface
            UICtrl.deleteListItem(itemID);

            // Update and show the new budget
            updateBudget();

            updatePercentages();
        }
    }

    return {
        init: function()
        {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
} )(budgetController, UIController);

controller.init();