'use strict';
var request = require("request")

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

    var cardTitle = "Hello, World!"
    var speechOutput = "Hello, I am developer companion, I help developers with a ton of usful things"
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", false));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
    // dispatch custom intents to handlers here

    if (intentName == 'DoYouRock'){
        handleDoYouRockRequest(intent, session, callback);
    }
    else if (intentName == 'BeerMaster'){
        handleBeerMasterRequest(intent, session, callback);
    }
    else if(intentName == 'OnTap'){
        handleBeersOnTapRequest(intent, session, callback);
    }
    else if(intentName == 'HelpDevelopers'){
        handleHelpDevelopersRequest(intent, session, callback);
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

function handleTestRequest(intent, session, callback) {
    var ssmlResponse = "<speak>I don't understand what you want from me. <break time='3s'/> Just kidding, I am elite companion, I am here to assist paramedics and help make their jobs easier. Also on occasion I tell developers what's on tap.</speak> "
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "false"));
}

function handleDoYouRockRequest(intent, session, callback) {
    var ssmlResponse = "<speak>Asking me if I rock is like asking if the pope is cathlolic. I'll show you how hard I rock <audio src='https://s3.amazonaws.com/alexabucketforhooly/output.mp3' /> </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "false"));
}

function  handleBeersOnTapRequest(intent, session, callback){
    var ssmlResponse = "<speak>I don't think you need anymore beer Jack, you really should start working out, The current beers on tap are Grain Belt Premium and Horizon Red I.P.A</speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "false"));
}

function handleHelpDevelopersRequest(intent, session, callback){
    var ssmlResponse = "<speak>Okay I lied, the only thing I can do to help developers is tell them about their favorite beers. </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "false"));
}

function  handleBeerMasterRequest(intent, session, callback){
    var speechOutput = "I'm sorry I could not find that beer, can you please try another one?"
    getJSON(function(data){
        if(data != "ERROR"){
            var speechOutput = data
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard("<speak>"+speechOutput +"</speak>", "", "false"));
    })
    //callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", "false"))
}

function handleDoYouRockRequest(intent, session, callback) {
    var ssmlResponse = "<speak>Asking me if I rock is like asking if the pope is cathlolic. I'll show you how hard I rock <audio src='https://s3.amazonaws.com/alexabucketforhooly/output.mp3' /> </speak>"
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(ssmlResponse, "", "false"));
}

function url(){
    return "https://api.untappd.com/v4/search/beer?q=surly wet&client_id=BBACBA7037E0853F0940B31E5958EDBC5CFCCA0E&client_secret=CCC2AC27771C678B2937A6DAF040B3BE1C5F1E67";
}

function getJSON(callback){
    request.get(url(), function(err, response, body){
        var d = JSON.parse(body);
        var result = d.response.beers.items[0].beer.beer_description;
        if(!!result){
            callback(result);
        }
        else {
            callback("ERROR");
        }
    })
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