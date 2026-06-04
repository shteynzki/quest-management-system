module GamesHelper
  def slot_price(time)
    case time.hour
    when 9..11 then 1000
    when 12..17 then 2000
    else 3000
    end
  end

  def slot_booked?(quest_id, time)
    Game.exists?(quest_id: quest_id, time: time)
  end

  def get_game_for_slot(quest_id, time)
    Game.find_by(quest_id: quest_id, time: time)
  end


  def get_actors_for_shift(quest_id, date)
    actor_ids = ActorSchedule.where(quest_id: quest_id, day_of_week: date.wday).pluck(:user_id)
    User.where(id: actor_ids).pluck(:name)
  end
end