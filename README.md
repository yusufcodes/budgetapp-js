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

### Inserting Elements into the DOM

There are many methods which can achieve this, but once is called **insertAdjacentHTML**. Notes supplemented using [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

```javascript
element.insertAdjacentHTML(position, text);

// Position: The position that the new HTML should be placed, relative to the referenced element.

- 'beforebegin': Before the element itself.
- 'afterbegin': Just inside the element, before its first child.
- 'beforeend': Just inside the element, after its last child.
- 'afterend': After the element itself.

<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->

// Text: String to be parsed and entered as HTML
```

### Array - forEach method

Below shows how to use the forEach method on a given array.

```javascript
var array1 = ['a', 'b', 'c'];

// You call the forEach method on the array itself, and then pass in an anonymous function (callback) to be executed with the forEach method.

/* PARAMETERS:
'current' [REQUIRED]: The current element currently selected in the loop.

Optional parameters:
'index': The current element's index (e.g. 0);
'array': The actual array being iterated over;
'thisArg': Ability to set the 'this' variable within the callback function.
*/
array1.forEach(function ()
{
    // Code
});
```

