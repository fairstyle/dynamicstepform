'use strict';

class Dynamicstepform {

    dynamicsteps = {
        correctCreate: false,
        customAccessVarName: null,
        currentStepIndex: null,
        steps: null,
        styleMotor: "tailwindcss",
        element: null,
        resetEnabled: false,
        backEnabled: false,
        flexEnabled: false
    }

    snippetElements = {
        buttonNext: null,
        currentStep: null,
        currentStepTopStatus: null,
        nextStep: null,
        nextStepTopStatus: null,
        backStep: null,
        backStepTopStatus: null
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

        if(!Array.isArray(this.dynamicsteps.steps) || this.dynamicsteps.steps === undefined || this.dynamicsteps.steps.length < 1)
            return false;
        else
            this.dynamicsteps.correctCreate = true;

        let nextStepButton = '<div class="text-center py-3"><button onclick="'+(this.dynamicsteps.customAccessVarName ? this.dynamicsteps.customAccessVarName:"new Dynamicstepform()" )+'.nextStep()" class="bg-green-400 text-white font-black p-3 hover:bg-green-600 hover:text-gray-100 rounded">'+
            '<svg style="width:20px;height:16px;" class="inline-block svg-inline--fa fa-circle-chevron-right pr-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM358.6 278.6l-112 112c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L290.8 256L201.4 166.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l112 112C364.9 239.6 368 247.8 368 256S364.9 272.4 358.6 278.6z"></path></svg><span id="dynamicstepformButtonName">Next Step</span></button></div>';

        let htmlContent = '<div id="addUserSteps" class="py-4 flex justify-center gap-4">';
        let createdStep = 1;

        this.dynamicsteps.steps.forEach((step) => {
            if(createdStep !== 1)
                document.getElementById(step.element).classList.add("hidden");

            let classListToAdd = ["duration-200", "transform", "transition-transform", "translate-x-full", "z-["+createdStep+"]"]
            if(this.dynamicsteps.flexEnabled)
                classListToAdd.push("flex");
            document.getElementById(step.element).classList.add(...classListToAdd);

            htmlContent += '<div id="dynamicstepformstatusstep'+createdStep+'" class="duration-200 bg-white border border-gray-400 w-8 h-8 rounded-full text-gray-500 font-black flex justify-center items-center">'+createdStep+'</div>';
            createdStep++;
        })

        htmlContent += '</div>';
        element.innerHTML =htmlContent+"<div class='flex'>"+element.innerHTML+"</div>"+nextStepButton;

        this.snippetElements.buttonNext = document.getElementById("dynamicstepformButtonName");

        this.dynamicsteps.currentStepIndex = 0;
        this.markAsCurrent(this.dynamicsteps.currentStepIndex);

    }

    steps(steps = []) {
        this.dynamicsteps.steps = steps;
    }

    opts(opts = {}) {
        this.dynamicsteps.customAccessVarName = opts.customAccessVarName;
    }

    async nextStep(){
        if(this.dynamicsteps.nextStepLoading)
            console.log("is currently loading");

        if(!this.dynamicsteps.correctCreate || this.dynamicsteps.nextStepLoading)
            return false;

        let response = true;
        this.dynamicsteps.nextStepLoading = true;

        if(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].call !== null){
            response = await Promise.all([this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].call()]).then((value) => {
                return value[0];
            });
        }

        if(response && this.dynamicsteps.steps.length-1 > this.dynamicsteps.currentStepIndex){
            this.markAsDone(this.dynamicsteps.currentStepIndex);
            this.snippetElements.currentStep.classList.add("hidden");
            this.snippetElements.currentStep.classList.add("-translate-x-full");
            this.markAsCurrent(this.dynamicsteps.currentStepIndex+1);
        }
        this.dynamicsteps.nextStepLoading = false;
    }

    backStep(){
        this.clearStep();
        this.snippetElements.currentStep.classList.add("hidden" , "translate-x-full");
        this.snippetElements.backStep.classList.remove("-translate-x-full");
        this.snippetElements.currentStepTopStatus.classList.add("bg-white", "text-gray-500", "border", "border-gray-400");
        this.snippetElements.currentStepTopStatus.classList.remove("bg-green-400", "bg-gray-400", "text-white");
        this.dynamicsteps.currentStepIndex--;
    }

    clearStep(){
        if(this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].clearStep !== undefined)
            this.dynamicsteps.steps[this.dynamicsteps.currentStepIndex].clearStep();
    }

    reset(){
        if(this.dynamicsteps.currentStepIndex === 0)
            this.clearStep();

        if(this.dynamicsteps.currentStepIndex < 1)
            return false;

        while(this.dynamicsteps.currentStepIndex > 0){
            this.markAsCurrent(this.dynamicsteps.currentStepIndex);
            this.backStep();
        }

        this.clearStep();
        this.markAsCurrent(this.dynamicsteps.currentStepIndex);
    }

    markAsDone(){
        this.snippetElements.currentStepTopStatus.classList.add("bg-green-400");
        this.snippetElements.currentStepTopStatus.classList.remove("border-gray-500", "border", "text-gray-500");
    }

    markAsCurrent(indexStep){
        this.setSnippets(indexStep);
        this.dynamicsteps.currentStepIndex = indexStep;
        this.snippetElements.currentStep.classList.add("delay-200");
        this.snippetElements.currentStep.classList.remove("hidden");
        this.snippetElements.currentStep.classList.remove("translate-x-full");
        this.snippetElements.currentStepTopStatus.classList.add("bg-gray-400", "border", "text-white");
        this.snippetElements.currentStepTopStatus.classList.remove("text-gray-500", "bg-green-400");
        this.snippetElements.buttonNext.innerText = this.dynamicsteps.currentStepIndex === this.dynamicsteps.steps.length-1 ? "Complete" : "Next Step";
    }

    setSnippets(indexStep){

        // for steps index are 0...n | for steps top status index are 1...n | this is the reason why we need to add 1 to the indexStep
        // current step
        this.snippetElements.currentStep = document.getElementById(this.dynamicsteps.steps[indexStep].element);
        this.snippetElements.currentStepTopStatus = document.getElementById('dynamicstepformstatusstep'+(indexStep+1));
        // back step
        this.snippetElements.backStep = indexStep > 0 ? document.getElementById(this.dynamicsteps.steps[indexStep-1].element) : null;
        this.snippetElements.backStepTopStatus = indexStep > 0 ? document.getElementById('dynamicstepformstatusstep'+(indexStep)) : null;
        // next step
        this.snippetElements.nextStep = indexStep < this.dynamicsteps.steps.length-1 ? document.getElementById(this.dynamicsteps.steps[indexStep+1].element) : null;
        this.snippetElements.nextStepTopStatus = indexStep < this.dynamicsteps.steps.length-1 ? document.getElementById('dynamicstepformstatusstep'+(indexStep+2)) : null;
    }

}

module.exports =  Dynamicstepform;