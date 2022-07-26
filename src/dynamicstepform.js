class Dynamicstepform {

    dynamicsteps = {
        "currentStepIndex": null,
        "steps": null,
        "styleMotor": "tailwindcss"
    }

    constructor() {

        // Prevent run in Node env
        if (typeof window === 'undefined')
            return false;

        if (Dynamicstepform._instance)
            return Dynamicstepform._instance;

        Dynamicstepform._instance = this;
    }

    create(element) {
        let nextStepButton = '<div class="text-center py-3"><button onclick="new Dynamicstepform().nextStep();" class="bg-green-400 text-white font-black p-3 hover:bg-green-600 hover:text-gray-100 rounded">'+
            '<svg style="width:20px;height:16px;" class="inline-block svg-inline--fa fa-circle-chevron-right pr-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM358.6 278.6l-112 112c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L290.8 256L201.4 166.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l112 112C364.9 239.6 368 247.8 368 256S364.9 272.4 358.6 278.6z"></path></svg><span id="dynamicstepformButtonName">Next Step</span></button></div>';

        let htmlContent = '<div id="addUserSteps" class="py-4 flex justify-center gap-4">';
        let createdStep = 1;
        if(this.dynamicsteps.steps === undefined)
            return false;

        this.dynamicsteps.steps.forEach((step) => {
            if(createdStep !== 1)
                document.getElementById(step.element).classList.add("hidden");

            htmlContent += '<div id="dynamicstepformstatusstep'+createdStep+'" class="bg-gray-400 w-8 h-8 rounded-full text-white font-black flex justify-center items-center">'+createdStep+'</div>';
            createdStep++;
        })

        htmlContent += '</div>';
        element.innerHTML = htmlContent+element.innerHTML+nextStepButton;

        this.dynamicsteps.currentStepIndex = 0;
        this.markAsCurrent(this.dynamicsteps.currentStepIndex);

    }

    steps(steps = []) {
        this.dynamicsteps.steps = steps;
    }

    nextStep(){
        if(!this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].call())
            return false;

        if(this.dynamicsteps.steps.length-1 > this.dynamicsteps.currentStepIndex){
            this.markAsDone(this.dynamicsteps.currentStepIndex);
            this.markAsCurrent(this.dynamicsteps.currentStepIndex+1);
        }

        if(this.dynamicsteps.currentStepIndex === this.dynamicsteps.steps.length-1)
            document.getElementById("dynamicstepformButtonName").innerText = "Complete";

    }

    markAsDone(indexStep){
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.add("bg-green-400");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.remove("border-gray-500", "border");
        document.getElementById(this.dynamicsteps.steps[indexStep].element).classList.add("hidden");
    }

    markAsCurrent(indexStep){
        this.dynamicsteps.currentStepIndex = indexStep;
        document.getElementById(this.dynamicsteps.steps[indexStep].element).classList.remove("hidden");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.add("border-gray-500", "border");
    }

}