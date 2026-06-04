class Api::QuestsController < ApplicationController
  include SlotGenerator
  skip_before_action :verify_authenticity_token
  before_action :require_login, only: [:order]

  def index
    quests = Quest.includes(:tags).all
    render json: quests.as_json(include: :tags)
  end

  def show
    quest = Quest.includes(:tags).find(params[:id])
    if current_user
      view = current_user.quest_views.find_or_initialize_by(quest_id: quest.id)
      view.touch unless view.new_record?
      view.save if view.new_record?
    end
    render json: quest.as_json(include: :tags)
  end

  def timetable
    quest_id = params[:id].to_i
    date = params[:date].present? ? Date.parse(params[:date]) : Date.today
    slots = generate_slots(quest_id, date)
    booked_times = Game.where(quest_id: quest_id, time: date.beginning_of_day..date.end_of_day).pluck(:time)

    formatted_slots = slots.map do |time|
      {
        time: time.strftime("%H:%M"),
        full_time: time,
        is_booked: booked_times.include?(time),
        is_past: time < Time.current,
        price: slot_price(time)
      }
    end

    render json: { 
      date: date.strftime("%Y-%m-%d"), 
      display_date: date.strftime("%d.%m.%Y"), 
      slots: formatted_slots 
    }
  end

  def order
    game = current_user.games.build(quest_id: params[:id], time: params[:time], info: params[:info])
    if game.save
      render json: { message: "Успешно забронировано", game_id: game.id }, status: :created
    else
      render json: { errors: game.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def slot_price(time)
    case time.hour
    when 9..11 then 1000
    when 12..17 then 2000
    else 3000
    end
  end
end