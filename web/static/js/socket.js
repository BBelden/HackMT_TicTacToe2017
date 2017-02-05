// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"
import $ from "jquery"

let socket = new Socket("/socket", {params: {token: window.userToken}})

let teams = ["X", "O"]
let myTeamName = "X"
let theTurn = 0

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("game:lobby", {})
channel.join()
  .receive("ok", resp => {
    console.log(resp)
    myTeamName = resp.team.toUpperCase()
    $('#teamAssigned').addClass(`is${myTeamName}`).html(myTeamName)
    $("#team").html(resp.turn).addClass("is" + resp.turn)
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
    $(this).html("<div class=\"myVote\">" + myTeamName + "</div>")
  }
})

channel.on("tick_state", payload => {
  console.log(payload)
  $("#timer").html(payload.time_remaining)
  let teamName = payload.team.toUpperCase()
  let teamClass = `is${teamName}`
  let teamEl = $("#team")
  if (!teamEl.hasClass(teamClass)) {
    teamEl.html(teamName).removeClass("isX").removeClass("isO").addClass(teamClass)
  }
  if (payload.time_remaining == 15) {
    if (myTeamName == teamName) {
      $(".button").removeClass("disabledButton")
      $(".isX").addClass("disabledButton")
      $(".isO").addClass("disabledButton")
    }
    else {
      $(".button").addClass("disabledButton")
    }
  }
})


// reset functions
function resetTurn(teamTurn = "X") {
  console.log("reset")
  $(".button").removeClass("disabledButton")
  $(".isX, .isO").addClass("disabledButton")
  if (myTeamName != teamTurn) {
    $(".button").addClass("disabledButton")
  }
}

function resetBoard() {
  console.log("reset board")
  $("#result").hide()
  theTurn = 0
  $("#team").html(teams[theTurn]).addClass("is" + teams[theTurn]).removeClass("is" + teams[(theTurn + 1) % 2])
  $(".button").removeClass("disabledButton").removeClass("isX").removeClass("isO").html("&nbsp;&nbsp;&nbsp;")
  mytimer.reset()
}

function endGame() {
  $("#result").show()
}

$("#testturnbtn").click(resetTurn)
$("#testboardbtn").click(resetBoard)
$("#testendgamebtn").click(endGame)

export default socket
