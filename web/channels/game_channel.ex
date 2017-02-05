defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    team = TicTacToe.Worker.get_value(:teamPlayer)
    cond do
      team == :o -> :x
        TicTacToe.Worker.put_value(:teamPlayer, :x)

      team == :x -> :o
        TicTacToe.Worker.put_value(:teamPlayer, :o)
      end
    IO.puts(TicTacToe.Worker.get_value(:teamPlayer))
    {:ok, team, assign(socket, :teamPlayer, team)}
  end

  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("vote", %{"vote" => vote}, socket) do
    my_team = IO.inspect(Map.get(socket.assigns, :teamPlayer))
    TicTacToe.Worker.apply_vote(my_team, vote)
    {:reply, {:ok, %{"vote" => vote, "my_team" => my_team}}, socket}
  end

  def tick(time_remaining) do
    current_state = TicTacToe.Worker.get_cache()
    TicTacToe.Endpoint.broadcast! "game:lobby", "tick_state", current_state
  end
end
