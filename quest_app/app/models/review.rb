class Review < ApplicationRecord
  belongs_to :user
  belongs_to :quest

  validates :score, presence: true, inclusion: { in: 1..5 }
end