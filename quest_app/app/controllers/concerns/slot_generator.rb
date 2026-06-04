module SlotGenerator
  extend ActiveSupport::Concern

  private

  def generate_slots(quest_id, date)
    if (1..6).include?(quest_id.to_i)
      start_time = date.in_time_zone.change(hour: 10, min: 0)
      end_time = date.in_time_zone.change(hour: 23, min: 30)
    else
      start_time = date.in_time_zone.change(hour: 9, min: 30)
      end_time = date.in_time_zone.change(hour: 21, min: 30)
    end

    slots = []
    current_time = start_time
    
    while current_time <= end_time
      slots << current_time
      current_time += 90.minutes
    end
    
    slots
  end
end