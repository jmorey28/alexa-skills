'use strict';

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var ssmlResponse = "<speak> I don't know what you want from me. <break time='1.5s'/> Just kidding, I am elite companion, how can I help you today? </speak>"
    callback(session.attributes,
       buildSpeechletResponseWithoutCard(ssmlResponse, "", false));
}

/**
 * Called when the user specifies an intent for this skill.
 * Checklists obtained from snocountyems.org
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;


    // dispatch custom intents to handlers here
    if (intentName == 'AboutAlexa') {
        handleTestRequest(intent, emslists, session, callback);
    }
    else if (intentName =='HelpParamedics')
    {
        handleHelpParamedics(intent, session, callback);
    }
     if (intentName == 'DoYouRock'){
        handleDoYouRockRequest(intent, session, callback);
    }
    else if (intentName == 'CoolThingsElite'){
        handleCoolThingsEliteRequest(intent, session, callback);
    }
    else if (intentName == 'ListTheLists')
    {
        handleListTheListsRequest(intent, session, callback)
    }
    else if (intentName == 'EMSLists'){
        var emslists
        if (!!intentRequest.intent.slots.Lists.value) {
         emslists = intentRequest.intent.slots.Lists.value;
        }
       //var age
       // if (!!intentRequest.intent.slots.Age.value) {
        // age = intentRequest.intent.slots.Age.value;
        //}
        handleEMSListsRequest(intent, emslists,  session, callback);
    }
    else if (intentName == 'Narrative')
    {
        handleNarrativeRequest(intent, session, callback)
    }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleTestRequest(intent, emslists, session, callback) {
    var ssmlResponse
    ssmlResponse = "<speak> I help paramedics while they are in the field. </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", false));
}
function handleHelpParamedics(intent, session, callback) {
    var ssmlResponse
    ssmlResponse = "<speak> I can recite checklists and document narratives. </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", false));
}
 function handleListTheListsRequest(intent, session, callback) {
     var ssmlResponse
    ssmlResponse = "<speak> I support CPR, cardiac arrest, and chest pain check lists.</speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", false));
 }
function handleDoYouRockRequest(intent, session, callback) {
    var ssmlResponse = "<speak>Asking me if I rock is like asking if the pope is cathlolic. I'll show you how hard I rock <audio src='https://s3.amazonaws.com/alexabucketforhooly/output.mp3' /> </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "true"));
}

function handleCoolThingsEliteRequest(intent, session, callback) {
    var ssmlResponse = "<speak>There are many functions that can be done through Elite. </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "true"));
}
function handleEMSListsRequest(intent, emslists, session, callback) {
    var ssmlResponse
    //if (emslists == 'c.p.r' || emslists == 'CPR') {
      // handleCPRRequest(intent, emslists, age, session, callback)
    //}
    if (emslists == 'chest pain') {
      handleChestPainRequest(intent, emslists, session, callback)
    }
     else if (emslists == 'cardiac arrest') {
       ssmlResponse = "<speak> This is the Cardiac Arrest check list </speak>"
    }
    //else if (!!session.attributes.previousintent && (session.attributes.previousintent == 'c.p.r' || emslists == 'CPR')){
         //handleCPRRequest(intent, session.attributes.previousintent, age, session, callback)
    //}
    else {

    ssmlResponse = "<speak> These are the check Lists I can launch. CPR. Head Trauma. Cardiac Arrest. Chest Pain. If you would like to start a check list, please say launch check list name. </speak>"
    }
     callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", false));
}

function handleNarrativeRequest(intent, session, callback) {
     var ssmlResponse;
    ssmlResponse = "<speak> Open the runform Jack, and I'll show you my true power. <break time='1.5s'/> Jack Morey was found unconscious in an abandoned pool. He stunk of baby food and dirty diapers. </speak>"
     callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", true));
}
function handleCPRRequest(intent, emslists, age, session, callback) {
    var ssmlResponse;
    //ssmlResponse = "<speak> Okay, what is the age group of the patient </speak>"
   if (age == 'infant') {
    ssmlResponse = "<speak>This is a checklist for CPR on an infant. Compressions: Place 2 fingers in the center of the chest, just below the nipple line. Perform 30 compressions in no less than 15 and no more than 18 seconds. Compressions at least one third the depth of the chest, about 1 and half inches. Complete Recoil after each compression. Breaths: Give 2 breaths with a barrier device: Each breath is given over 1 second. There should be a visible chest rise with each breath. Resume COmpression in less than 10 seconds. </speak>"
    }
    else if (age == 'child')
    {
         ssmlResponse = "<speak>This is a checklist for CPR on a child. Carefully place the child on their back. If there is a chance the child has a spinal injury, two people should move the child to prevent the head and neck from twisting. Place the heel of one hand on the breastbone -- just below the nipples. Make sure your heel is not at the very end of the breastbone. Keep your other hand on the child's forehead, keeping the head tilted back. Press down on the child's chest so that it compresses about 1/3 to 1/2 the depth of the chest. Give 30 chest compressions. Each time, let the chest rise completely. These compressions should be fast and hard with no pausing. Open the airway. Lift up the chin with one hand. At the same time, tilt the head by pushing down on the forehead with the other hand. Look, listen, and feel for breathing. Place your ear close to the child's mouth and nose. Watch for chest movement. Feel for breath on your cheek. If the child is not breathing: Cover the child's mouth tightly with your mouth. Pinch the nose closed. Keep the chin lifted and head tilted. Give two rescue breaths. Each breath should take about a second and make the chest rise. </speak>"
    }
    else if (age == 'adult')
    {
        ssmlResponse = "<speak>This is a checklist for CPR on an Adult. pen the airway. With the person lying on his or her back, tilt the head back slightly to lift the chin. Check for breathing. Listen carefully, for no more than 10 seconds, for sounds of breathing. (Occasional gasping sounds do not equate to breathing.) If there is no breathing begin CPR. Push hard, push fast. Place your hands, one on top of the other, in the middle of the chest. Use your body weight to help you administer compressions that are at least 2 inches deep and delivered at a rate of at least 100 compressions per minute. Deliver rescue breaths. With the person's head tilted back slightly and the chin lifted, pinch the nose shut and place your mouth over the person's mouth to make a complete seal. Blow into the person's mouth to make the chest rise. Deliver two rescue breaths, then continue compressions. Continue CPR steps. Keep performing cycles of chest compressions and breathing until the person exhibits signs of life, such as breathing, an AED becomes available, or EMS or a trained medical responder arrives on scene.   </speak>"
    }
    else {
        ssmlResponse = "<speak> A valid age must be given for the CPR checklist. The ages I accept are infant, child, or adult. </speak>"
        session.attributes.previousintent = emslists
    }

     //ssmlResponse = "<speak>This is a checklist for CPR on an Adult. pen the airway. With the person lying on his or her back, tilt the head back slightly to lift the chin. Check for breathing. Listen carefully, for no more than 10 seconds, for sounds of breathing. (Occasional gasping sounds do not equate to breathing.) If there is no breathing begin CPR. Push hard, push fast. Place your hands, one on top of the other, in the middle of the chest. Use your body weight to help you administer compressions that are at least 2 inches deep and delivered at a rate of at least 100 compressions per minute. Deliver rescue breaths. With the person's head tilted back slightly and the chin lifted, pinch the nose shut and place your mouth over the person's mouth to make a complete seal. Blow into the person's mouth to make the chest rise. Deliver two rescue breaths, then continue compressions. Continue CPR steps. Keep performing cycles of chest compressions and breathing until the person exhibits signs of life, such as breathing, an AED becomes available, or EMS or a trained medical responder arrives on scene.   </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", false));
}

function handleChestPainRequest(intent, emslists,  session, callback) {
      var ssmlResponse;

        ssmlResponse = "<speak> This is a checklist for chest pain. 12 Lead E.K.G.. in under 10 minutes. Then Administer aspirin, or document reason not administered. Then, Establish I.V.. Administer NTG, unless contraindicated. Blablabla. This is hooley day. you get the point. </speak>"
        //If CODE STEMI-Announce CODE STEMI and proceed with next steps, otherwise ignore them. Identify nearest PCI capable Open Cath Lab. Then, Notify ED of a Code STEMI. Next, Administer aspirin or document reason not administered. Establish IV. NTG, MS, fentanyl considered. Consider second I.V. Serial 12 Lead EKGs. Limit scene time to less than 15 min, Code Transport. On a Side Note, NTG is contraindicated in male or female patients who have recently taken any of the following: sildenafil, vardenafil, tadalafil, and riociguat. </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", false));

}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}