class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:email])
    
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      }, status: :ok
    else
      render json: { error: "Неверный email или пароль" }, status: :unauthorized
    end
  end

  def destroy
    session[:user_id] = nil
    head :no_content
  end
end