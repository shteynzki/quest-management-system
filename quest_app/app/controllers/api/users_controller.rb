class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def me
    if current_user
      render json: { 
        id: current_user.id, 
        email: current_user.email, 
        name: current_user.name, 
        role: current_user.role 
      }, status: :ok
    else
      render json: { error: "Not authorized" }, status: :unauthorized
    end
  end

  def create
    user = User.new(user_params)
    user.role = "player"

    if user.save
      session[:user_id] = user.id
      render json: { 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :last_name, :email, :password, :password_confirmation)
  end
end