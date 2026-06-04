class Api::SchedulesController < ApplicationController
  include SlotGenerator

  def index
    unless current_user&.admin? || current_user&.actor?
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    view_mode = params[:view_mode] || 'by_date'
    
    if view_mode == 'by_date'
      date = params[:date].present? ? Date.parse(params[:date]) : Date.today
      quests = Quest.order(:id)
      
      daily_slots = quests.map do |quest|
        slots = generate_slots(quest.id, date)
        booked_games = Game.where(quest_id: quest.id, time: date.beginning_of_day..date.end_of_day).index_by(&:time)
        actor_schedules = ActorSchedule.includes(:user).where(quest_id: quest.id, day_of_week: date.wday)
        actors_str = actor_schedules.map { |s| s.user.name }.join(", ")

        formatted_slots = slots.map do |time|
          game = booked_games[time]
          {
            time: time.strftime("%H:%M"),
            full_time: time,
            is_past: time < Time.current,
            is_booked: !!game,
            game_id: game&.id,
            actors: actors_str
          }
        end

        { id: quest.id, name: quest.name, slots: formatted_slots }
      end

      render json: { 
        view_mode: 'by_date', 
        date: date.strftime("%Y-%m-%d"), 
        display_date: date.strftime("%d.%m.%Y"), 
        data: daily_slots 
      }
    else
      quest_id = params[:quest_id].present? ? params[:quest_id].to_i : Quest.first&.id || 1
      start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : Date.today
      
      weekly_slots = (0..6).map do |i|
        current_day = start_date + i.days
        slots = generate_slots(quest_id, current_day)
        booked_games = Game.where(quest_id: quest_id, time: current_day.beginning_of_day..current_day.end_of_day).index_by(&:time)
        actor_schedules = ActorSchedule.includes(:user).where(quest_id: quest_id, day_of_week: current_day.wday)
        actors_str = actor_schedules.map { |s| s.user.name }.join(", ")

        formatted_slots = slots.map do |time|
          game = booked_games[time]
          {
            time: time.strftime("%H:%M"),
            full_time: time,
            is_past: time < Time.current,
            is_booked: !!game,
            game_id: game&.id,
            actors: actors_str
          }
        end

        { 
          date: current_day.strftime("%Y-%m-%d"), 
          display_date: current_day.strftime("%d.%m"), 
          slots: formatted_slots 
        }
      end

      quests_list = Quest.order(:id).select(:id, :name)
      render json: { 
        view_mode: 'by_quest', 
        quest_id: quest_id, 
        start_date: start_date.strftime("%Y-%m-%d"), 
        display_start_date: start_date.strftime("%d.%m.%Y"), 
        data: weekly_slots, 
        quests: quests_list 
      }
    end
  end
end