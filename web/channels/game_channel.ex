defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    team = TicTacToe.Worker.get_value(:team)
    cond do
      team == :o -> :x
        TicTacToe.Worker.put_value(:team, :x)

      team == :x -> :o
        TicTacToe.Worker.put_value(:team, :o)
      end
    IO.puts(TicTacToe.Worker.get_value(:team))
    {:ok, team, assign(socket, :team, team)}
  end

  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("vote", %{"vote" => vote}, socket) do
    IO.puts(vote)
    {:noreply, socket}
  end
  def tick do
    :tick
  end
end
