//console.log('I am working');
//Initialize Firebase
var config = {
    apiKey: "AIzaSyA5337DuR7xGw6gDfjC3x0vevDFaDbhQ3I",
    authDomain: "candyland-train-scheduler.firebaseapp.com",
    databaseURL: "https://candyland-train-scheduler.firebaseio.com",
    projectId: "candyland-train-scheduler",
    storageBucket: "",
    messagingSenderId: "503235581588"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

//Initial values


// Create on click function to capture text from the input box and push to database 
$("#add-train").on("click", function (event) {
    //prevent form from submitting 
    event.preventDefault();
    var trainName = "";
    var destination = "";
    var trainFirstTime = "";
    var frequency = "";
    //get input values
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    trainFirstTime = $("#frirst-Train-time").val().trim();
    frequency = $("#frequency").val().trim();


    //code to push to the database

    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainFirstTime: trainFirstTime,
        frequency: frequency,
        //dataAdded: firebase.database.ServerValue.TIMESTAMP\
    });
});

//Firebase watcher + initial loader
database.ref().on("child_added", function (childSnapshot) {
    //console.log(childSnapshot.val());
    //console log all the values added
    //console.log(childSnapshot.val().trainName);
    //console.log(childSnapshot.val().destination);
    //console.log(childSnapshot.val().trainFirstTime);

    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().trainFirstTime;
    var tFrequency = childSnapshot.val().frequency;


    // Time is 4:30 AM

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // $('#tname').append(trainName),
    //     $('#tdestination').append(destination),
    //     $('#nextArival').append(nextTrain),
    //     $('#frequency').append(frequency),
    //     $('#minuteAway').append(tMinutesTillTrain)
    var newRow = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(destination),
        $('<td>').text(frequency),
        $('<td>').text(nextTrain),
        $('<td>').text(nextTrain)
    );
    $('#table-row').append(newRow);
});
