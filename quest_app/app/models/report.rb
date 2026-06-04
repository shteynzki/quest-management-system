class Report < ApplicationRecord
  belongs_to :game
  belongs_to :actual_actor, class_name: 'User', optional: true
  
  has_one_attached :blank_photo
end