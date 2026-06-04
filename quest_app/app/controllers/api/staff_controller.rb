class Api::StaffController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_schedule]

  def index
    unless current_user&.admin?
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    actors = User.actor.includes(:actor_schedules).map do |actor|
      {
        id: actor.id,
        name: actor.name,
        last_name: actor.last_name,
        schedules: actor.actor_schedules.map { |s| { day: s.day_of_week, quest_id: s.quest_id } }
      }
    end

    quests = Quest.pluck(:id, :name).to_h
    all_schedules = ActorSchedule.includes(:user).all
    schedule_grid = {}

    quests.keys.each do |q_id|
      schedule_grid[q_id] = {}
      (0..6).each do |day|
        actors_for_shift = all_schedules.select { |s| s.quest_id == q_id && s.day_of_week == day }.map do |s| 
          { id: s.user.id, name: s.user.name }
        end
        schedule_grid[q_id][day] = actors_for_shift
      end
    end

    render json: {
      actors: actors,
      schedule_grid: schedule_grid,
      quests: quests
    }, status: :ok
  end

  def update_schedule
    unless current_user&.admin?
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    quest_id = params[:quest_id].to_i
    day_of_week = params[:day_of_week].to_i
    actor_ids = params[:actor_ids] || []

    ActorSchedule.where(quest_id: quest_id, day_of_week: day_of_week).destroy_all

    actor_ids.each do |actor_id|
      ActorSchedule.create!(quest_id: quest_id, day_of_week: day_of_week, user_id: actor_id)
    end

    render json: { message: "Расписание обновлено" }, status: :ok
  end

  def monthly_report
    unless current_user&.admin?
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    @month = params[:month].present? ? Date.parse(params[:month]) : Date.today.beginning_of_month
    @reports = Report.includes(:game, :actual_actor)
                     .where(games: { time: @month.beginning_of_month..@month.end_of_month })
                     .order('games.time DESC')
    
    respond_to do |format|
      format.pdf do
        render pdf: "monthly_report_#{@month.strftime('%Y_%m')}",
               template: "api/staff/monthly_report",
               formats: [:html],
               layout: "pdf",
               encoding: "UTF-8"
      end
    end
  end
end