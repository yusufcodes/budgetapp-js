// BUDGET CONTROLLER
var budgetController = ( function() {

    // Expense object: stores money that is spent, entered by the user
    var Expense = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // calcPercentage: Determine the percentage of income that this expense is using
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

    // getPercentage: Getter method for the 'percentage' property of the Expense object
    Expense.prototype.getPercentage = function()
    {
        return this.percentage;
    }

    // Income object: stores money that is received, entered by the user
    var Income = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    /* Name: calculateTotal
       Params: type: The type of income (inc or exp), a string
       Return: None
    */
    var calculateTotal = function(type)
    {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;

    };

    // Data: Object data structure storing values relating to all expenses and income values
    var data = {

        // allItems: Stores the individual incomes and expenses entered by the user
        allItems: {
            exp: [],
            inc: []
        },

        // Totals: Stores the total value for the Expenses and Incomes
        totals: {
            exp: 0,
            inc: 0
        },

        // budget: Calculation of total income - total expenses to show the remaining budget for the user
        // percentage: Percentage of income spent so far
        budget: 0,
        percentage: -1
    };

    return {
        /* Name: addItems - add an expense/income to the internal data structure
        Params:
        - type: The type of income (inc or exp), a string
        - desc: The description of the expense entered by the user
        - val: The total of the expense entered by the user
        Return: 
        - newItem: Object, type Expense or Income
        */
        
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

        /* Name: deleteItem - remove an expense entered by the user
        Params:
        - type: The type of income (inc or exp), a String
        - id: The specific ID of the income to remove
        Return: 
        - newItem: None
        */
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

        /* Name: calculateBudget: Gets the total incomes and expenses and calculates the difference to
        retrieve the budget.
        Params: None
        Return: None
        */
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

        /* Name: calculatePercentages: Iterates over each expense to calculate the individual
        percentages entered by the user, using the calcPercentage method
        Params: None
        Return: None
        */
        calculatePercentages: function() 
        {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        /* Name: getPercentages: Getter method to retrieve the individual percentage of each expense
        Params: None
        Return: 
        - allPerc: An array constructed using the map method, storing each percentage value for the individual
        expenses
        */
        getPercentages: function() 
        {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });

            return allPerc;
        },

        /* Name: getBudget: Getter method to return private values
        Params: None
        Return: Object storing the following:
        - budget: The total budget 
        - totalInc: Total value of incomes
        - totalExp: Total value of expenses
        - percentage: Percentage of the budget spent
        */
        getBudget: function() 
        {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
    }
} )();
// END OF BUDGET CONTROLLER

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

    /* Name: formatNumber: Formats an input value to produce a number which represents an income,
    Example: 1000 -> + 1,000 for an income of £1,000
             25000 -> - 25,000 for an expense of £25,000
    Params:
    - num: (String) The number to be formatted
    - type: The type (inc or exp) of value being formatted
    Return: String with the formatted value, prepended with + / - depending on if it is an Income / Expense
    */
    var formatNumber = function(num, type)
    {
        var numSplit, int, dec, type;

        // Takes the absolute value of the number passed in and rounds it to 2 decimal places
        num = Math.abs(num);
        num = num.toFixed(2);

        // numSplit - an array containing the parts of the number passed in, split at any '.'
        numSplit = num.split('.');

        // Integer part of the number
        int = numSplit[0];

        // String manipulation to place comma in position to represent money value 
        // 1000 -> 1,000
        // 25000 -> 25,000
        if (int.length > 3)
        {
            int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
        }

        // Decimal part of the number
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    /* Name: nodeListForEach: A custom forEach method for the nodeList, returned when retrieving 
    HTML DOM elements. This is created because there is no built in forEach methods, so this replicates it 
    for the purpose of this application.
    Params:
    - list: The nodeList to perform operations on
    - callback: The method to be called on each element in the nodeList
    Return: None
    */
    var nodeListForEach = function(list, callback)
    {
        /* The following for loop will iterate over each element of the nodeList and perform 
        the desired operation, which is performed by the callback function */
        for (var i = 0; i < list.length; i++)
        {
            callback(list[i], i);
        }
    };

    return {
        /* Name: getInput: Retrieve the inputs from the fields entered by the user
        Params: None
        Return:
        - type: The type of expense entered by the user (inc or exp)
        - description: The description entered by the user
        - value: The cost of the expense entered by the user
        */
        getInput: function()
        {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                // String -> Float
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        /* Name: addListItem: Add an item to the UI once the user enters an expense
        Params:
        - obj: The income/expense as an Object of type Income or Expense
        - type: The type of expense: inc or exp
        Return: None
        */
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

        /* Name: deleteListItem: Remove an element from the UI upon deletion
        Params:
        - selectorID: The ID of the item to delete
        Return: None
        */
        deleteListItem: function(selectorID)
        {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        /* Name: clearFields: Clear the input fields enterred by the user upon submission of an expense
        Params: None
        Return: None
        */
        clearFields: function()
        {
            // Retrieving the DOM elements to be cleared
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            // List -> Array, creates a copy of the array equivalence in fieldsArr
            var fieldsArr = Array.prototype.slice.call(fields);

            // Iterating over the newly created Array, setting the value attribute to an empty string
            fieldsArr.forEach(function(current) {
                current.value = "";
            });

            // Set the focus of the fields back to the first one
            fieldsArr[0].focus();
        },

        /* Name: displayBudget: Sets the textContent of particular elements to the respective values,
        retrieved from th
        Params:
        - Object containing all of the values calculated for the application such as totals
        Return: None
        */
        displayBudget: function(obj)
        {
            // Determining the type of the income based on the current budget value
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            // Setting the content of the DOM element text content
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            // Formatting the appearance of the percentage
            if (obj.percentage > 0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        /* Name: displayPercentages: Setting the DOM text content for the percentage of each of the 
        entered Expenses
        Params: 
        - percentages: The list of percentages which are being assigned to the textContent of the expenses
        Return: None
        */
        displayPercentages: function(percentages)
        {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

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

        /* Name: displayMonth - retrieving and formatting the date and displaying it within the respective DOM element
        Params: None
        Return: None
        */
        displayMonth: function()
        {
            var now, month, year;
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        /* Name: changedType: A method to detect when a user switches between an Expense / Income, and as a result,
        changing the highlighted input element colours between Red and Blue
        Params: None
        Return: None
        */
        changedType: function() 
        {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },


        // getDOMStrings: Returns the DOMStrings to be used elsewhere in the application
        getDOMstrings: function()
        {
            return DOMstrings;
        }
    }
} )();
// END OF UI CONTROLLER

// GLOBAL APP CONTROLLER
/*
Params:
- budgetCtrl: The budget controller
- UICtrl: The UI controller
*/
var controller = ( function(budgetCtrl, UICtrl) 
{
    // setupEventListeners: Event Listeners are setup and added in this method
    var setupEventListeners = function() 
    {
        var DOM = UICtrl.getDOMstrings();

        // Trigger the event to add an item to the budget app
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Allows for user to press the Enter key to submit an expense
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });

        // Event Delegation: all incomes and expenses (nested within DOM.container) will be assigned the event ctrlDeleteItem
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        // Triggers the change of colour on the input fields (Blue <-> Red) when switching between Expense / Income
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    /* Name: updateBudget: Calls the methods to calculate the budget, retrieve the budget, and finally
    display the budget on the screen
    Params: None
    Return: None
    */
    var updateBudget = function() 
    {
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        var budget = budgetCtrl.getBudget();

        // Display the budget in the UI
        UICtrl.displayBudget(budget);
    };

    /* Name: updatePercentages: Calls the methods to calculate the %, retrieve the % and then display the %
    Params: None
    Return: None
    */
    var updatePercentages = function() 
    {
        // Calculate the percentages
        budgetCtrl.calculatePercentages();

        // Read the percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // Update the UI
        UICtrl.displayPercentages(percentages);
    };

    /* Name: ctrlAddItem: Faciliates the addition of an element to the budget app. Methods are called from the
    budget and UI controllers to allow for the values entered by the user to be added and displayed to the app.
    Params: None
    Return: None
    */
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

            // Calculate the percentage and display to the screen
            updatePercentages();
        }
    };

    /* Name: ctrlDeleteItem: Faciliates the deletion of an expense from the application
    Params: event - this becomes available from any event triggered via 'addEventListener'
    Return: None
    */
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

            // Update and show the new percentages
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