defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    payload = TicTacToe.Worker.get_cache()
    team = Enum.random([:x, :o])
    payload = Map.put(payload, :team_assignment, team)
    #team = TicTacToe.Worker.get_value(:teamPlayer)
    #cond do
    #  team == :o -> :x
    #    TicTacToe.Worker.put_value(:teamPlayer, :x)

    #  team == :x -> :o
    #    TicTacToe.Worker.put_value(:teamPlayer, :o)
    {:ok, payload, assign(socket, :team, team)}
  end

  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("vote", %{"vote" => vote}, socket) do
    my_team = Map.get(socket.assigns, :team)
    IO.puts(my_team)
    TicTacToe.Worker.apply_vote(my_team, vote)
    {:reply, {:ok, TicTacToe.Worker.get_cache()}, socket}
  end

  def tick(time_remaining) do
    current_state = TicTacToe.Worker.get_cache()
    TicTacToe.Endpoint.broadcast! "game:lobby", "tick_state", current_state
  end
end
