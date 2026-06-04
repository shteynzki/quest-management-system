class Api::ReviewsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :require_login

  def create
    game = Game.find(params[:game_id])
    
    review = Review.find_or_initialize_by(user_id: current_user.id, quest_id: game.quest_id)
    review.score = params[:score]
    review.text = params[:text]

    if review.save
      render json: { message: "Created" }, status: :created
    else
      render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
    end
  end
end