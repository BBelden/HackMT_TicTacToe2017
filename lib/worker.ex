defmodule TicTacToe.Worker do
  use GenServer

  def start_link(opts \\ []) do
    {:ok, pid} = GenServer.start_link(__MODULE__, [], opts)
  end
  def init(state) do
    :timer.apply_interval(:timer.seconds(1), TicTacToe.GameChannel, :tick, [])
    {:ok, state}
  end
end
