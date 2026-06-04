class QuestTag < ApplicationRecord
  belongs_to :quest
  belongs_to :tag
end