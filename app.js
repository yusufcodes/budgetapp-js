// IIFE that returns an object containing all public objects
var budgetController = ( function() {
    var x = 23;
    var add = function(a)
    {
        return x + a;
    }

    // Making the following properties publicly accessible
    return {
        publicTest: function(b) {
            return add(b);
        }
    }

} )();

var UIController = ( function() 
{

} )();

var controller = ( function(budgetCtrl, UICtrl) 
{
    var z = budgetCtrl.publicTest(5);

    return {
        publicTwo: function() {
            console.log(z);
        }
    }
    
} )(budgetController, UIController);

controller.publicTwo();