// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"
import $ from "jquery"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

// timer stuff


function turnTimer(start) {
  var base = this
  base.timeleft = start
  $("#timer").html(base.timeleft)
  base.maxtime = 15
  base.tick = function() {
    console.log("tick")
    base.timeleft = Math.max(0, base.timeleft - 1)
    //base.timeleft--
    $("#timer").html(base.timeleft)
  }
  base.reset = function() {
    base.timeleft = base.maxtime
  }
  base.run = function() {
    setInterval(base.tick, 1000)
  }
}

let mytimer = new Object()
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

channel.on("time_tick", payload => {
	$("#timer").html(payload.time_remaining)
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
