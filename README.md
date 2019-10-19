# budgetapp-js

## Coding Notes

### Implementing a Module Pattern

Separating code into modules is useful for the purpose of encapsulation. Variables and methods can be kept private unless you choose to make it public.

#### How it works

The JavaScript concepts of **Immediately Invoked Function Expressions (IIFEs)** and **Closures** work together to allow for these module patterns to be created.

- IIFEs: Allows for a function to be called immediately, allowing for our module to run instantly.
- Closures: Allows for any inner functions that are declared to remember the execution context of the outer function from which it is defined.

```javascript
var modulePattern = (function() {
    // Module code goes here
    var testVariable = 5;

    var someFunction = function()
    {
        console.log(testVariable);
    }

    // Return any methods or variables which will allow access to the private properties of the module
    return {
        publicFunction: function()
        {
            console.log(someFunction());
        }
    }
})();
```