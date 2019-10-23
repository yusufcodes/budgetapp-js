
// BUDGET CONTROLLER
var budgetController = ( function() {

    // Data Structures to store an Expense or Income
    var Expense = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    };

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
        expensesContainer: '.expenses__list'

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
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            else if (type === 'exp')
            {
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML from the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    };

    var updateBudget = function() 
    {
        // Calculate the budget
        // TODO: Use calculateBudget method here
        budgetCtrl.calculateBudget();

        // Return the budget
        var budget = budgetCtrl.getBudget();

        // Display the budget in the UI
        console.log(budget);
    }

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
        }
    };

    return {
        init: function()
        {
            console.log('Application has started');
            setupEventListeners();
        }
    }
} )(budgetController, UIController);

controller.init();