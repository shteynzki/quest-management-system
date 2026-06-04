class Api::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:destroy]
  before_action :require_login, only: [:destroy]

  def show
    game = Game.includes(:quest, :user).find(params[:id])
    
    base_price = case game.time.hour
                 when 9..11 then 1000
                 when 12..17 then 2000
                 else 3000
                 end

    actors = User.actor.select(:id, :name, :last_name)

    render json: {
      game: {
        id: game.id,
        quest_name: game.quest.name,
        time: game.time.strftime("%d.%m.%Y в %H:%M")
      },
      base_price: base_price,
      actors: actors
    }, status: :ok
  end

  def destroy
    game = Game.find(params[:id])
    
    if current_user.admin? || (game.user_id == current_user.id && game.time > Time.current)
      game.destroy
      render json: { message: "Бронь отменена" }, status: :ok
    else
      render json: { error: "Невозможно отменить" }, status: :forbidden
    end
  end
end