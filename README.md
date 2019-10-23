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

### Event Delegation

Event Delegation is a JavaScript concept used when we want an event listener to be attached to multiple elements. Below is a description of how this works:

- Event Bubbling: The concept of an event being fired on particular child element e.g. button as well as the parent elements, up the DOM tree.
  
- Target Element: The DOM element which initially triggered the event to occur, which is stored in the event object. This allows for this element to be identified.

- Event Delegation: The concept of attaching an event to a parent element, to wait for the event to bubble up from the target element.

#### Event Delegation - Use Cases

1. Where there is an element with lots of child elements that we want to target.
2. Where we need to attach events to elements that do not exist in the DOM yet.

### The Event Object

Linking back to Event Delegation, we can use the 'event' object from an event listener's callback method to identify different things.

For example, the following code will identify the **parent element** of the child element which an event was called on:

```javascript
event.target.parentNode
```

There will be cases where you will need to traverse up the DOM tree, to get to a specific element. This is known as **DOM Traversal**, and although this is not the best practice as it involves hardcoding and relying on the DOM structure, this is one way to do it:

```javascript
event.target.parentNode.parentNode.parentNode [...] // Continue until desired element has been reached
```
