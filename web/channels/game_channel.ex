defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    IO.puts "game lobby joined by foo"
    {:ok, socket}
  end
  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end
end
