class Tag < ApplicationRecord
  has_many :quest_tags, dependent: :destroy
  has_many :quests, through: :quest_tags

  validates :name, presence: true, uniqueness: true
end