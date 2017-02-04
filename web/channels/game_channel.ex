defmodule TicTacToe.GameChannel do
  use Phoenix.Channel

  def join("game:lobby", _message, socket) do
    team = Enum.random([:x, :o])
    {:ok, team, assign(socket, :team, team)}
  end

  def join("game:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("vote", %{"vote" => vote}, socket) do
    my_team = IO.inspect(Map.get(socket.assigns, :team))

    #Check to see whether my_team is equal to turn
    if true do
        IO.puts("Vote: "<>to_string(vote))
    	IO.puts("Team: "<>to_string(my_team))
        {:reply, {:ok, %{"vote" => vote, "my_team" => my_team}}, socket}
    else
	{:noreply, socket}
    end

  end
end
