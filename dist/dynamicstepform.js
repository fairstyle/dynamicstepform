class Dynamicstepform {

    dynamicsteps = {
        currentStepIndex: null,
        steps: null,
        styleMotor: "tailwindcss",
        element: null,
        elementInnerHTML: null,
        resetEnabled: false,
        backEnabled: false
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

            document.getElementById(step.element).classList.add("duration-500", "transform", "transition-transform", "translate-x-full", "z-["+createdStep+"]", "flex");

            htmlContent += '<div id="dynamicstepformstatusstep'+createdStep+'" class="duration-500 bg-white border border-gray-400 w-8 h-8 rounded-full text-gray-500 font-black flex justify-center items-center">'+createdStep+'</div>';
            createdStep++;
        })

        htmlContent += '</div>';
        element.innerHTML =htmlContent+"<div class='flex'>"+element.innerHTML+"</div>"+nextStepButton;

        this.dynamicsteps.currentStepIndex = 0;
        this.markAsCurrent(this.dynamicsteps.currentStepIndex);

    }

    steps(steps = []) {
        this.dynamicsteps.steps = steps;
    }

    nextStep(){
        if(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].call !== undefined && !this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].call())
            return false;

        if(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].call === undefined)
            console.log("no validation");

        if(this.dynamicsteps.steps.length-1 > this.dynamicsteps.currentStepIndex){
            this.markAsDone(this.dynamicsteps.currentStepIndex);
            this.markAsCurrent(this.dynamicsteps.currentStepIndex+1);
        }
    }

    backStep(){
        this.clearStep();
        document.getElementById(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].element).classList.add("hidden");
        document.getElementById(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex-1].element).classList.remove("-translate-x-full");
        document.getElementById("dynamicstepformstatusstep"+(this.dynamicsteps.currentStepIndex+1)).classList.remove("bg-green-400", "bg-gray-400", "text-white");
        document.getElementById("dynamicstepformstatusstep"+(this.dynamicsteps.currentStepIndex+1)).classList.add("bg-white", "text-gray-500", "border", "border-gray-400");

        this.dynamicsteps.currentStepIndex--;
    }

    clearStep(){
        if(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].clearStep !== undefined)
            this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].clearStep();
    }

    reset(){
        if(this.dynamicsteps.currentStepIndex === 0){
            this.clearStep();
        }

        if(this.dynamicsteps.currentStepIndex < 1)
            return false;

        while(this.dynamicsteps.currentStepIndex > 0){
            this.backStep();
        }

        this.clearStep();
        this.markAsCurrent(0);
    }

    markAsDone(indexStep){
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.add("bg-green-400");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.remove("border-gray-500", "border", "text-gray-500");
        document.getElementById(this.dynamicsteps.steps[indexStep].element).classList.add("-translate-x-full");

        setTimeout(() => {
            document.getElementById(this.dynamicsteps.steps[indexStep].element).classList.add("hidden");
        }, 500);
    }

    markAsCurrent(indexStep){
        this.dynamicsteps.currentStepIndex = indexStep;
        document.getElementById(this.dynamicsteps.steps[indexStep].element).classList.remove("hidden");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.add("bg-gray-400", "border");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.add("text-white", "border");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.remove("text-gray-500");
        document.getElementById("dynamicstepformstatusstep"+(indexStep+1)).classList.remove("bg-green-400");
        setTimeout(() => {
            document.getElementById(this.dynamicsteps.steps[indexStep].element).classList.remove("translate-x-full");
        }, 200);

        if(this.dynamicsteps.currentStepIndex === this.dynamicsteps.steps.length-1)
            document.getElementById("dynamicstepformButtonName").innerText = "Complete";
        else
            document.getElementById("dynamicstepformButtonName").innerText = "Next Step";
    }

}