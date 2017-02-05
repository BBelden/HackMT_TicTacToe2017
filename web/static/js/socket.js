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
let teamColors = {"X": "red", "O": "blue"}
let gameOver = false;

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("game:lobby", {})
channel.join()
  .receive("ok", resp => {
    console.log(resp)
    myTeamName = resp.team_assignment.toUpperCase()
    $('#teamAssigned').addClass(`is${myTeamName}`).html(myTeamName)
    $("#team").html(resp.turn).addClass("is" + resp.turn)
    // set the board
    if (myTeamName != resp.team.toUpperCase()) {
      $(".button").addClass("disabledButton")
    }
    show_board(resp)
  })
  .receive("error", resp => { console.log("Unable to join", resp) })


function show_board(resp) {
  let currColor = teamColors[resp.team.toUpperCase()]
  resp.board.forEach(function(e, i, arr) {
    if (e != null) {
      $("#b" + i).html(e.toUpperCase()).addClass("is" + e.toUpperCase()).addClass("disabledButton")
    }
  })
   resp.votes.forEach(function(e, i, arr) {
     if (!($("#b" + i).hasClass("isX") || $("#b" + i).hasClass("isO"))) {
       $("#b" + i).html(e)
     }
   })
}

$('.board .button').on('click', function(evt) {
  if (!$(this).hasClass("disabledButton")) {
    let selectedIdx = $(evt.currentTarget).data('idx')
    console.log(selectedIdx)
    channel.push("vote", {vote: selectedIdx})
    $(".button").addClass("disabledButton")
    $(this).addClass("myVote" + myTeamName)
  }
})

// Handle clock tick-
channel.on("tick_state", payload => {
  console.log(payload)
  show_board(payload)
  $("#timer").html(payload.time_remaining)
  let teamName = payload.team.toUpperCase()
  let teamClass = `is${teamName}`
  let teamEl = $("#team")
  if (!teamEl.hasClass(teamClass)) {
    teamEl.html(teamName).removeClass("isX").removeClass("isO").addClass(teamClass)
  }
  if (payload.time_remaining == 15) {
    $(".myVote" + myTeamName).removeClass("myVote" + myTeamName)
    if (myTeamName == teamName) {
      $(".button").removeClass("disabledButton")
      $(".isX").addClass("disabledButton")
      $(".isO").addClass("disabledButton")
    }
    else {
      $(".button").addClass("disabledButton")
    }
    $(".button").each(function(i) {
        if (!($(this).hasClass("isX") || $(this).hasClass("isO"))) {
          $(this).html("&nbsp;&nbsp;&nbsp;")
        }
      }
    )
  }
  if (payload.winner && !gameOver) {
    gameOver = true
    $("#winnerSpan").addClass("is" + payload.winner.toUpperCase()).html(payload.winner.toUpperCase() + " WINS!")
    $("#result").show()
  }
  else if (payload.tie && !gameOver) {
    gameOver = true
    $("#winnerSpan").html("BOTH TEAM KNOW HOW THIS GAME WORKS")
    $("#result").show()
  }
  else if (gameOver && !payload.tie && !payload.winner) {
    gameOver = false;
    $("#result").hide()
    $("#winnerSpan").removeClass("isX").removeClass("isO")
    $("#team").html(teams[theTurn]).addClass("is" + teams[theTurn]).removeClass("is" + teams[(theTurn + 1) % 2])
    $(".button").removeClass("myVote" + myTeamName).removeClass("disabledButton").removeClass("isX").removeClass("isO").html("&nbsp;&nbsp;&nbsp;")
  }
})


function resetBoard() {
  console.log("reset board")
  $("#result").hide()
  $("#winnerSpan").removeClass("isX").removeClass("isO")
  theTurn = 0
  $("#team").html(teams[theTurn]).addClass("is" + teams[theTurn]).removeClass("is" + teams[(theTurn + 1) % 2])
  $(".button").removeClass("myVote" + myTeamName).removeClass("disabledButton").removeClass("isX").removeClass("isO").html("&nbsp;&nbsp;&nbsp;")
  mytimer.reset()
}

function endGame() {
  $("#result").show()
}

export default socket
