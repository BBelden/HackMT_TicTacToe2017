// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"
import $ from "jquery"

let socket = new Socket("/socket", {params: {token: window.userToken}})

let teams = ["X", "O"]
let teamName = "X"
let theTurn = 0

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("game:lobby", {})
channel.join()
  .receive("ok", resp => {
    teamName = resp.toUpperCase()
    $('#teamAssigned').addClass(`is${teamName}`).html(teamName)
    if (resp.turn == "X" || 1) {
      theTurn = 0
    }
    else {
      theTurn = 1
    }
    $("#team").html(teams[theTurn]).addClass("is" + teams[theTurn])
    // set the board
  })
  .receive("error", resp => { console.log("Unable to join", resp) })

channel.on("new_msg", payload => {
  console.log(payload)
})

$('.board .button').on('click', function(evt) {
  if (!$(this).hasClass("disabledButton")) {
    let selectedIdx = $(evt.currentTarget).data('idx')
    console.log(selectedIdx)
    channel.push("vote", {vote: selectedIdx})
    $(".button").addClass("disabledButton")
  }
})

channel.on("tick_state", payload => {
  $("#timer").html(payload.time_remaining)
  let teamName = payload.team.toUpperCase()
  let teamClass = `is${teamName}`
  let teamEl = $("#team")
  if (!teamEl.hasClass(teamClass)) {
    teamEl.html(teamName).addClass(teamClass)
  }
})


// reset functions
function resetTurn() {
  console.log("reset")
  mytimer.reset()
  theTurn = (theTurn + 1) % 2
  $("#team").html(teams[theTurn]).addClass("is" + teams[theTurn]).removeClass("is" + teams[(theTurn + 1) % 2])
  $(".button").removeClass("disabledButton")
  $(".isX, .isO").addClass("disabledButton")
  if (teamName != teams[theTurn]) {
    $(".button").addClass("disabledButton")
  }
}

function resetBoard() {
  console.log("reset board")
  theTurn = 0
  $("#team").html(teams[theTurn]).addClass("is" + teams[theTurn]).removeClass("is" + teams[(theTurn + 1) % 2])
  $(".button").removeClass("disabledButton").removeClass("isX").removeClass("isO").html("&nbsp;&nbsp;&nbsp;")
  mytimer.reset()
}

$("#testturnbtn").click(resetTurn)
$("#testboardbtn").click(resetBoard)

export default socket
