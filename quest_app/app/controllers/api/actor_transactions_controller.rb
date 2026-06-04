class Api::ActorTransactionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    actors = User.actor.map do |actor|
      {
        id: actor.id,
        name: actor.name,
        transactions: actor.actor_transactions.select(:category, :transaction_type, :amount),
        total: actor.actor_transactions.sum(:amount).to_i
      }
    end
    render json: actors, status: :ok
  end

  def create
    unless current_user&.admin?
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    transaction = ActorTransaction.new(transaction_params)
    transaction.amount = ActorTransaction::RATES[params[:category]] || params[:amount]
    
    if transaction.save
      render json: transaction, status: :created
    else
      render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def transaction_params
    params.permit(:user_id, :category, :amount, :transaction_type, :comment)
  end
end