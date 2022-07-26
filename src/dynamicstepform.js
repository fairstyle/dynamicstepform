'use strict';

console.log("Hola Mundo!");

class Dynamicstepform {
    constructor(...args) {

        // Prevent run in Node env
        if (typeof window === 'undefined') {
            return false;
        }
        console.log("Stepform 👌");
    }
}

Dynamicstepform.version = '1.0.0';
module.export =  Dynamicstepform;