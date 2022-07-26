'use strict';

class Dynamicstepform {

    dynamicsteps = {
        "currentStepIndex": null,
        "steps": null,
        "styleMotor": "tailwindcss"
    }

    tailwindSteps = {
        "doneColorClass": "",
        "currentColorClass": "",
        "nextColorClass": "",
    }

    cssSteps = {
        "doneColorClass": "",
        "currentColorClass": "",
        "nextColorClass": "",
    }

    constructor(steps = [], opts = {}) {

        // Prevent run in Node env
        if (typeof window === 'undefined') {
            console.log("No nodejs 👌");
            return false;
        }

        this.opts(opts);
        this.steps(steps);

        steps.forEach((step) => {
            console.log(step.step)
            step.call();
        })

        console.log("created Stepform");
    }

    create(element) {
        console.log(element, "CREATE")
        element.innerHTML("<h1>HOLAAAAA</h1>");
    }

    opts(opts = {}) {
        console.log(opts);
    }

    steps(steps = []) {
        console.log(steps);
    }


}

module.exports =  Dynamicstepform;
