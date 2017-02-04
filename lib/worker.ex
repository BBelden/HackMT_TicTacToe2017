defmodule TicTacToe.Worker do
  use GenServer

  def get_value(cache, key) do
    ConCache.get(cache, key)
  end
  def give_value(cache, key, value) do
    ConCache.put(cache, key, value)
    {:ok, []}
  end
  def start_link(opts \\ []) do
    {:ok, pid} = GenServer.start_link(__MODULE__, [], opts)
  end

  def timer(0), do: :ok
  def timer(n) do
      IO.puts n
      timer(n-1)
    end
  def init(state) do
    :timer.apply_interval(:timer.seconds(1), TicTacToe.Worker, start_link [])
    #ConCache.put(:game_state, :countdown, countdown)
    ConCache.put(:game_state, :board_state, %{
      '0' => nil, '1' => nil, '2' => nil,
      '3' => nil, '4' => nil, '5' => nil,
      '6' => nil, '7' => nil, '8' => nil
      })
    ConCache.put(:game_state, :team, :o)
    {:ok, state}
  end
end
