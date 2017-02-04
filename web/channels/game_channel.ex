defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    team = Enum.random([:x, :o])
    {:ok, team, assign(socket, :team, team)}
  end

  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end
  def tick do
    IO.inspect(:tick)
  end
end
