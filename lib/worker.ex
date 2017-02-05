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

  def get_cache() do
    %{
      team: get_value(:team),
      #board: get_value(:board),
      #votes: get_value(:votes),
      time_remaining: get_value(:time_remaining)
    }
  end

  def init_board() do
    put_value(:time_remaining, 15)
    put_value(:board, %{
      0 => nil, 1 => nil, 2 => nil,
      3 => nil, 4 => nil, 5 => nil,
      6 => nil, 7 => nil, 8 => nil
    })
    put_value(:votes, %{
      0 => 0, 1 => 0, 2 => 555555,
      3 => 0, 4 => 0, 5 => 0,
      6 => 0, 7 => 0, 8 => 0
    })
    ConCache.put(:game_state, :team, :o)
    put_value(:board_full,false)
    put_value(:winner,nil)
  end

  def init(state) do
    init_board()
    :timer.apply_interval(:timer.seconds(1), TicTacToe.Worker, :timer_tick, [])
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
    case prev do
      prev when prev in 1..15 ->
        TicTacToe.GameChannel.tick(prev-1)
        put_value(:time_remaining, prev-1)
      0 ->
        turn_over()
    end
  end
  ##
  # End timer
  ##

  ##
  # Vote tallying stuff
  ##
  def apply_vote(team, vote_idx) do
    # Team?
    # ...add vote
  end


  ##
  # End vote tallying stuff
  ##

  ##
  #  end of turn stuff
  ##
  def reset_timer() do
    put_value(:time_remaining, 15)
  end

  def update_board() do
    board = get_value(:board)
    highest = get_value(:votes)
      |> Enum.sort(fn({_, lhs}, {_, rhs}) ->
          lhs >= rhs
        end)
      |> List.first
    board = if get_value(:team) == :x do
      Map.put(board,highest,:x)
    else
      Map.put(board,highest,:o)
    end
    ## check for winner here
  end

  def reset_votes() do
    put_value(:votes, %{
      0 => 0, 1 => 0, 2 => 0,
      3 => 0, 4 => 0, 5 => 0,
      6 => 0, 7 => 0, 8 => 0
    })
  end

  def change_team() do
    if get_value(:team) == :x do
      put_value(:team,:o)
    else put_value(:team,:x)
    end
  end

  def is_game_over() do
    board = get_value(:board)
    cond do
      !Enum.any?(board, fn({k,v}) -> v == nil end) ->
        ## board full
        ## TODO game tie output?
        init_board()
      get_value(:winner) != nil ->
        ## winner!
        init_board()
      true ->
        true
    end
  end

  def turn_over() do
    update_board()
    reset_votes()
    change_team()
    reset_timer()
    is_game_over()
  end

  ##
  #  end end of turn stuff
  ##
end
