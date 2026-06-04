class Api::DashboardsController < ApplicationController
  def show
    unless current_user
      render json: { error: "Not authorized" }, status: :unauthorized
      return
    end

    if current_user.admin?
      admin_data
    elsif current_user.actor?
      actor_data
    else
      player_data
    end
  end

  private

  def player_data
    my_games = current_user.games.order(time: :desc).includes(:quest).map do |g|
      has_review = Review.exists?(user_id: current_user.id, quest_id: g.quest_id)
      { 
        id: g.id, 
        quest_id: g.quest_id,
        quest_name: g.quest.name, 
        time: g.time.strftime("%d.%m.%Y %H:%M"),
        is_past: g.time < Time.current,
        has_review: has_review
      }
    end
    
    recommender = Recommender.new(current_user)
    
    content_recs = recommender.content_based(3).map do |q|
      { id: q.id, name: q.name, info: q.info.truncate(80) }
    end
    
    collab_recs = recommender.collaborative_filtering(3).map do |q|
      { id: q.id, name: q.name, info: q.info.truncate(80) }
    end

    hybrid = collab_recs.any? ? collab_recs : content_recs

    render json: { 
      role: 'player', 
      my_games: my_games, 
      recommended: hybrid
    }
  end

  def actor_data
    my_schedules = current_user.actor_schedules
    actor_booked_games = Game.includes(:report, :quest).select do |game|
      my_schedules.any? { |s| s.quest_id == game.quest_id && s.day_of_week == game.time.wday }
    end.sort_by(&:time).reverse.map do |g|
      {
        id: g.id,
        quest_name: g.quest.name,
        time: g.time.strftime("%d.%m.%Y %H:%M"),
        is_past: g.time < Time.current,
        has_report: g.report.present?
      }
    end
    render json: { role: 'actor', upcoming_shifts: actor_booked_games }
  end

  def admin_data
    games_by_quest = Game.joins(:quest).where('time < ?', Time.current).group('quests.name').count
    
    last_7_days = (6.days.ago.to_date..Date.today).to_a
    revenue_by_day = last_7_days.map do |date|
      daily_revenue = Report.joins(:game).where(games: { time: date.beginning_of_day..date.end_of_day }).sum(:actual_amount)
      [date.strftime("%d.%m"), daily_revenue]
    end.to_h

    render json: {
      role: 'admin',
      revenue_by_day: revenue_by_day,
      games_by_quest: games_by_quest
    }
  end
end