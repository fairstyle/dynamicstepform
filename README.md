# stepform

Whenever I start a new project, I don't know what to write for the first commit. After doing a “git init” there is technically nothing there...

## Warning
This is a very early package. It is not ready for use.

## Install

```npm
npm install dynamicstepform
```

# Usage
This package need tailwindcss for now to work

```javascript
let element = document.getElementById("stepformdiv");
let stepform = new Dynamicstepform();
// stepone | steptwo | stepthree - all this are id of divs
stepform.steps([
    {
        "element": "stepone", 
        "call": resolveAfter3Seconds, //Promisse example
        "clearStep": () => {console.log("clear step 1");return true;}
    },{
        "element": "steptwo", 
        "call": resolveAfterResponse,  //Promisse example
        "clearStep": () => {console.log("clear step 2");return true;}
    },{
        "element": "stepthree", 
        "call": () => {console.log("step 3");return true;}, 
        "clearStep": () => {console.log("clear step 3");return true;}
    }
]);
stepform.opts({
    customAccessVarName: "stepform" // Optional
});
stepform.create(element);
```

### Example calls
Example calls for validate steps with promises

```javascript
function resolveAfter3Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("a");
            resolve(true);
        }, 3000);
    });
}

function resolveAfterResponse() {
    return new Promise(async resolve => {
        let json = await fetch("localhost", {
            method: 'GET',
            headers: new Headers({
                'Access-Control-Allow-Origin': '*',
            }),
        }).then(res => res)
            .catch(error => {
                console.log(error)
            })
            .then(response => {
                return response;
            });
        resolve(json.status === 200);
    });
}
```

### Utils Methods
Methods for manipulating steps

```javascript
// to create a new stepform
stepform.create();

// next step
stepform.nextStep();

// back step
stepform.backStep();

// clear current step
stepform.clearStep();

// reset stepform
stepform.reset();
```

# Contributing
If someone wants to add or improve something, I invite you to collaborate directly in this repository: [dynamicstepform](https://github.com/fairstyle/dynamicstepform)

# License
dynamicstepform is released under the [MIT License](https://opensource.org/licenses/MIT).