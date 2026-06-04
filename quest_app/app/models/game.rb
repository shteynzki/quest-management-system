class Game < ApplicationRecord
  belongs_to :user
  belongs_to :quest
  has_one :report, dependent: :destroy

  validates :time, presence: true
  validates :quest_id, presence: true
  
  validate :time_cannot_be_in_the_past

  private

  def time_cannot_be_in_the_past
    if time.present? && time < Time.current
      errors.add(:time, "не может быть в прошлом!")
    end
  end
end