defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    team = Enum.random([:x, :o])
    {:ok, team, assign(socket, :team, team)}
  end

  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end
<<<<<<< HEAD

=======

  def handle_in("vote", %{"vote" => vote}, socket) do
    IO.puts(vote)
    {:noreply, socket}
>>>>>>> 64a5ffab4e771c5b0f4307d7e116baa185c9cc72
  def tick do
    IO.inspect(:tick)
  end
end
