defmodule TicTacToe.Worker do
  use GenServer

  ##
  # Important stuff, DON'T CHANGE
  ##
  def start_link(opts \\ []) do
    {:ok, pid} = GenServer.start_link(__MODULE__, [], opts)
  end

  def get_value(key) do
    ConCache.get(:game_state, key)
  end

  def put_value(key, value) do
    ConCache.put(:game_state, key, value)
  end

  def init(state) do
    put_value(:time_remaining, 15)
    :timer.apply_interval(:timer.seconds(1), TicTacToe.Worker, :timer_tick, [])
    ConCache.put(:game_state, :board, %{
      '0' => nil, '1' => nil, '2' => nil,
      '3' => nil, '4' => nil, '5' => nil,
      '6' => nil, '7' => nil, '8' => nil
      })
    ConCache.put(:game_state, :votes, %{
      '0' => 0, '1' => 0, '2' => 0,
      '3' => 0, '4' => 0, '5' => 0,
      '6' => 0, '7' => 0, '8' => 0
    })
    ConCache.put(:game_state, :team, :o)
    {:ok, state}
  end
  ##
  # End important stuff
  ##

  ##
  # Timer
  ##
  def timer_tick() do
    prev = get_value(:time_remaining)
    IO.puts prev
    case prev do
      prev when prev in 1..15 ->
        put_value(:time_remaining, prev-1)
      0 ->
        put_value(:time_remaining, 15)
      end
  end
  ##
  # End timer
  ##

  ##
  # Vote tallying stuff
  ##
  def apply_vote(team, vote_idx) do
    # ...
  end


  ##
  # End vote tallying stuff
  ##

  ##
  #
  ##
  def reset_timer() do
    put_value(:time_remaining, 15)
  end

  def update_board() do
  end

  def reset_votes() do
    put_value(:votes, %{
      '0' => 0, '1' => 0, '2' => 0,
      '3' => 0, '4' => 0, '5' => 0,
      '6' => 0, '7' => 0, '8' => 0
    })
  end

  def change_team() do
    if (get_value(:team) == :x) do
      put_value(:team,:o)
    else put_value(:team,:x)
    end
  end

  def turn_over() do
    # update board
    # reset votes
    # change team
  end



  ##
  #
  ##
end
